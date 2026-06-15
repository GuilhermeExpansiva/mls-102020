/// <mls fileReference="_102020_/l2/agentMaterializeSolution/agentMaterialize.ts" enhancement="_102027_/l2/enhancementAgent"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import {
  readProjectJson,
  scanModuleDefsFiles,
} from '/_102020_/l2/agentMaterializeSolution/agentMaterializeArtifacts.js';
import type { ScannedDefFile } from '/_102020_/l2/agentMaterializeSolution/agentMaterializePlan.js';

declare const mls: any;

export function createAgent(): IAgentAsync {
  return {
    agentName: 'agentMaterialize',
    agentProject: 102020,
    agentFolder: 'agentMaterializeSolution',
    agentDescription: 'Build materialize pipeline for all modules in a project',
    visibility: 'public',
    beforePromptImplicit,
    afterPromptStep,
  };
}

const TOOL_NAME = 'submitMaterializeBootstrap';

interface BootstrapModuleResult {
  moduleName: string;
  l1FileCount: number;
  l2FileCount: number;
  status: 'ok' | 'empty' | 'missing';
}

interface BootstrapOutput {
  status: 'ok' | 'failed';
  modules: BootstrapModuleResult[];
  notes: string[];
}

const bootstrapToolSchema = {
  type: 'function',
  function: {
    name: TOOL_NAME,
    description: 'Confirm the materialize bootstrap scan result.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['status', 'modules', 'notes'],
      properties: {
        status: { enum: ['ok', 'failed'] },
        modules: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['moduleName', 'l1FileCount', 'l2FileCount', 'status'],
            properties: {
              moduleName: { type: 'string' },
              l1FileCount: { type: 'number' },
              l2FileCount: { type: 'number' },
              status: { enum: ['ok', 'empty', 'missing'] },
            },
          },
        },
        notes: { type: 'array', items: { type: 'string' } },
      },
    },
  },
} as const;

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {
  const project = mls.actualProject || 0;
  const projectJson = await readProjectJson();

  if (!projectJson || !Array.isArray(projectJson.modules) || projectJson.modules.length === 0) {
    throw new Error(
      `[agentMaterialize] l5/project.json not found or has no modules in project ${project}`,
    );
  }

  const moduleSummaries = projectJson.modules.map(mod => {
    const scanned = scanModuleDefsFiles(project, mod.moduleName);
    const l1 = scanned.filter(f => f.layer === 'l1');
    const l2 = scanned.filter(f => f.layer === 'l2');
    return {
      moduleName: mod.moduleName,
      l1Files: l1.map(f => `${f.type}/${f.shortName}`),
      l2Files: l2.map(f => `${f.type}/${f.shortName}`),
    };
  });

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: 'add-message-ai',
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [
        { type: 'system', content: buildSystemPrompt() },
        { type: 'human', content: buildBootstrapHumanPrompt(moduleSummaries) },
      ],
      taskTitle: 'materializePipeline',
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: {
        taskName: 'materializePipeline',
        flowName: 'materialize',
      },
    },
  };

  return [addMessageAI];
}

async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
  try {
    const payload = step.interaction?.payload?.[0] as any;
    if (!payload) throw new Error('[agentMaterialize] missing payload');

    const output = extractBootstrapOutput(payload);
    if (output.status === 'failed') {
      return [createUpdateStatus(context, parentStep, step, hookSequential, 'failed', 'bootstrap returned failed')];
    }

    const project = mls.actualProject || 0;
    const projectJson = await readProjectJson();
    if (!projectJson) throw new Error('[agentMaterialize] project.json unavailable in afterPromptStep');

    const addStepIntents: mls.msg.AgentIntentAddStep[] = [];

    for (const mod of projectJson.modules) {
      const { moduleName } = mod;
      const scanned = scanModuleDefsFiles(project, moduleName);

      // L1 non-external files need LLM dependency resolution
      const l1NonExternal = scanned.filter(
        f => f.layer === 'l1' && f.type !== 'layer_1_external',
      );

      const resolvePlanIds: string[] = [];
      for (const file of l1NonExternal) {
        const planId = `mat-resolve-${toSafeId(moduleName)}-${toSafeId(file.shortName)}`;
        resolvePlanIds.push(planId);
        addStepIntents.push(buildResolveStep(context, step, planId, moduleName, file));
      }

      // One assemble step per module — waits for all its resolve deps
      const assemblePlanId = `mat-assemble-${toSafeId(moduleName)}`;
      addStepIntents.push(buildAssembleStep(context, step, assemblePlanId, moduleName, resolvePlanIds));
    }

    return addStepIntents;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return [createUpdateStatus(context, parentStep, step, hookSequential, 'failed', msg)];
  }
}

// ─── Step builders ─────────────────────────────────────────────────────────────

function buildResolveStep(
  context: mls.msg.ExecutionContext,
  rootStep: mls.msg.AIAgentStep,
  planId: string,
  moduleName: string,
  file: ScannedDefFile,
): mls.msg.AgentIntentAddStep {
  return {
    type: 'add-step',
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: rootStep.stepId,
    step: {
      type: 'agent',
      stepId: 0,
      interaction: null,
      stepTitle: `Resolve deps: ${moduleName}/${file.shortName}`,
      status: 'waiting_dependency',
      nextSteps: [],
      agentName: 'agentMaterializeResolveDeps',
      prompt: JSON.stringify({ planId, moduleName, shortName: file.shortName, type: file.type }),
      rags: [],
      planning: {
        planId,
        dependsOn: [],
        executionMode: 'parallel_static',
        executionHost: 'client',
      },
    } as any,
  };
}

function buildAssembleStep(
  context: mls.msg.ExecutionContext,
  rootStep: mls.msg.AIAgentStep,
  planId: string,
  moduleName: string,
  dependsOn: string[],
): mls.msg.AgentIntentAddStep {
  return {
    type: 'add-step',
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: rootStep.stepId,
    step: {
      type: 'agent',
      stepId: 0,
      interaction: null,
      stepTitle: `Assemble pipeline: ${moduleName}`,
      status: 'waiting_dependency',
      nextSteps: [],
      agentName: 'agentMaterializeAssemble',
      prompt: JSON.stringify({ planId, moduleName }),
      rags: [],
      planning: {
        planId,
        dependsOn,
        executionMode: 'sequential',
        executionHost: 'client',
      },
    } as any,
  };
}

// ─── Prompt builders ───────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return [
    'You are the materialize bootstrap agent.',
    'You receive a scan of all .defs.ts files found in a project and confirm each module is ready for pipeline generation.',
    `Call ${TOOL_NAME} with your assessment.`,
    'Mark a module as "ok" if it has files, "empty" if no defs were found, or "missing" if it is in project.json but completely absent.',
  ].join(' ');
}

function buildBootstrapHumanPrompt(
  summaries: Array<{ moduleName: string; l1Files: string[]; l2Files: string[] }>,
): string {
  const lines: string[] = ['# Materialize Bootstrap Scan', ''];
  for (const s of summaries) {
    lines.push(`## Module: ${s.moduleName}`);
    lines.push(`L1 (${s.l1Files.length} files): ${s.l1Files.join(', ') || '(none)'}`);
    lines.push(`L2 (${s.l2Files.length} files): ${s.l2Files.join(', ') || '(none)'}`);
    lines.push('');
  }
  lines.push('Confirm the status of each module and report any anomalies in notes.');
  return lines.join('\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractBootstrapOutput(payload: any): BootstrapOutput {
  const result = payload?.result ?? payload;
  if (result && typeof result === 'object' && !Array.isArray(result)) return result as BootstrapOutput;
  if (typeof result === 'string') {
    try { return JSON.parse(result); } catch { /* fall through */ }
  }
  return { status: 'failed', modules: [], notes: ['could not parse payload'] };
}

function toSafeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function createUpdateStatus(
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  status: mls.msg.AIStepStatus,
  traceMsg?: string,
): mls.msg.AgentIntentUpdateStatus {
  return {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep?.stepId ?? step.stepId,
    stepId: step.stepId,
    status,
    traceMsg,
  };
}
