/// <mls fileReference="_102020_/l2/agentMaterializeSolution/agentMaterializeL2.ts" enhancement="_102027_/l2/enhancementAgent"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import {
  readProjectJson,
  scanL2DefsWithPipeline,
  getFileModified,
  getContentByMlsPath,
  toMlsPath,
} from '/_102020_/l2/agentMaterializeSolution/agentMaterializeArtifacts.js';
import type {
  GenStepArgs,
  L2FileType,
  PipelineItem,
  ProjectJson,
} from '/_102020_/l2/agentMaterializeSolution/agentMaterializePlan.js';

declare const mls: any;

export function createAgent(): IAgentAsync {
  return {
    agentName: 'agentMaterializeL2',
    agentProject: 102020,
    agentFolder: 'agentMaterializeSolution',
    agentDescription: 'Generate L2 .ts files from .defs.ts pipeline definitions',
    visibility: 'public',
    beforePromptImplicit,
    afterPromptStep,
  };
}

// ─── Candidate: a .defs.ts that needs .ts generation ─────────────────────────

interface Candidate {
  folder: string;
  shortName: string;
  pipeline: PipelineItem[];
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  _userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {
  const project = mls.actualProject || 0;
  const projectJson = await readProjectJson();
  if (!projectJson?.modules?.length) {
    throw new Error('[agentMaterializeL2] l5/project.json not found or empty');
  }

  const summaries = [];
  for (const mod of projectJson.modules) {
    const candidates = await findCandidates(project, mod.moduleName);
    summaries.push({ moduleName: mod.moduleName, count: candidates.length });
  }

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: 'add-message-ai',
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [
        { type: 'system', content: systemPrompt },
        { type: 'human', content: buildHumanPrompt(summaries) },
      ],
      taskTitle: 'materialize-l2',
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: { taskName: 'materialize-l2', flowName: 'materialize-l2' },
    },
  };

  return [addMessageAI];
}

// ─── After LLM confirms — create generation steps ────────────────────────────

async function afterPromptStep(
  _agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  _parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
  try {
    const payload = step.interaction?.payload?.[0] as any;
    if (!payload) throw new Error('[agentMaterializeL2] missing payload');

    if (payload.type === 'result') {
      return [mkFail(context, _parentStep, step, hookSequential, String(payload.result))];
    }
    if (payload.type !== 'flexible' || payload.result?.status === 'failed') {
      const msg = payload.result?.notes?.join('; ') || 'scan confirmation failed';
      return [mkFail(context, _parentStep, step, hookSequential, msg)];
    }

    const project = mls.actualProject || 0;
    const projectJson = await readProjectJson();
    if (!projectJson) throw new Error('[agentMaterializeL2] project.json unavailable');

    const intents: mls.msg.AgentIntentAddStep[] = [];

    for (const mod of projectJson.modules) {
      const { moduleName } = mod;
      const moduleTsPath = toMlsPath(project, 2, moduleName, 'module', '.ts');
      const moduleTsContent = await getContentByMlsPath(moduleTsPath) ?? '';
      const candidates = await findCandidates(project, moduleName);

      for (const c of candidates) {
        const fileType = detectFileType(c.folder, moduleName);
        if (!fileType) continue;
        const skillPaths = resolveSkillPaths(fileType, moduleTsContent, projectJson);
        const planId = `gen-l2-${safe(moduleName)}-${safe(c.shortName)}-${fileType}`;
        const defPath = toMlsPath(project, 2, c.folder, c.shortName, '.defs.ts');
        const args: GenStepArgs = {
          planId,
          defPath,
          pipelineItem: c.pipeline[0],
          skillPaths,
          fileType,
        };
        intents.push(mkStep(context, step, planId, `Gen ${fileType}: ${moduleName}/${c.shortName}`, args));
      }
    }

    return intents;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return [mkFail(context, _parentStep, step, hookSequential, msg)];
  }
}

// ─── Candidate detection ──────────────────────────────────────────────────────

async function findCandidates(project: number, moduleName: string): Promise<Candidate[]> {
  const all = await scanL2DefsWithPipeline(project, moduleName);
  return all.filter(({ folder, shortName }) => {
    const defMod = getFileModified(project, 2, folder, shortName, '.defs.ts');
    const tsMod  = getFileModified(project, 2, folder, shortName, '.ts');
    if (tsMod === null) return true;        // no .ts yet
    if (defMod === null) return false;      // can't determine — skip
    return defMod > tsMod;                  // .defs.ts is newer
  });
}

// ─── File type detection ──────────────────────────────────────────────────────

function detectFileType(folder: string, moduleName: string): L2FileType | null {
  const rel = folder.slice(moduleName.length + 1); // strip "cafeFlow/"
  if (rel.startsWith('web/contracts')) return 'contract';
  if (rel.startsWith('web/shared'))    return 'shared';
  if (rel.startsWith('web/desktop'))   return 'page';
  return null;
}

// ─── Skill resolution ─────────────────────────────────────────────────────────

function resolveSkillPaths(
  fileType: L2FileType,
  moduleTsContent: string,
  projectJson: ProjectJson,
): string[] {
  if (fileType === 'contract') return extractContractSkillPaths(moduleTsContent);
  if (fileType === 'shared')   return extractSharedSkillPath(moduleTsContent);
  if (fileType === 'page') {
    const genome = extractGenomeConfig(moduleTsContent, 'web/desktop/page11');
    const paths: string[] = [];
    if (genome.layout) {
      const lp = projectJson.layouts?.[genome.layout]?.skillPath ?? [];
      paths.push(...lp);
    }
    if (genome.designSystem) {
      const dp = projectJson.designSystems?.[genome.designSystem]?.skillPath ?? [];
      paths.push(...dp);
    }
    return paths;
  }
  return [];
}

function extractContractSkillPaths(content: string): string[] {
  const match = content.match(/\bcontract\s*:\s*\{[^}]*skillPath\s*:\s*\[([\s\S]*?)\]/);
  if (!match) return [];
  return (match[1].match(/['"`]([^'"`]+)['"`]/g) ?? []).map(s => s.slice(1, -1));
}

function extractSharedSkillPath(content: string): string[] {
  const match = content.match(/sharedSkill\s*:\s*['"`]([^'"`]+)['"`]/);
  return match ? [match[1]] : [];
}

function extractGenomeConfig(
  content: string,
  subfolder: string,
): { layout?: string; designSystem?: string } {
  const escaped = subfolder.replace(/\//g, '\\/');
  const re = new RegExp(`['"\`]${escaped}['"\`]\\s*:\\s*\\{([^}]+)\\}`);
  const match = content.match(re);
  if (!match) return {};
  const block = match[1];
  const layout       = block.match(/\blayout\s*:\s*['"`]([^'"`]+)['"`]/)?.[1];
  const designSystem = block.match(/\bdesignSystem\s*:\s*['"`]([^'"`]+)['"`]/)?.[1];
  return { layout, designSystem };
}

// ─── Builders ─────────────────────────────────────────────────────────────────

function mkStep(
  context: mls.msg.ExecutionContext,
  rootStep: mls.msg.AIAgentStep,
  planId: string,
  title: string,
  args: GenStepArgs,
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
      stepTitle: title,
      status: 'waiting_human_input',
      nextSteps: [],
      agentName: 'agentMaterializeGen',
      prompt: JSON.stringify(args),
      rags: [],
      planning: { planId, dependsOn: [], executionMode: 'parallel_static', executionHost: 'client' },
    } as any,
  };
}

function mkFail(
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  traceMsg: string,
): mls.msg.AgentIntentUpdateStatus {
  return {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep?.stepId ?? step.stepId,
    stepId: step.stepId,
    status: 'failed',
    traceMsg,
  };
}

function safe(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

const systemPrompt = `<!-- modelType: codepro -->

You confirm the L2 generation scan.

If files were found, return:
{"type":"flexible","result":{"status":"ok","notes":[]}}

If nothing to generate, return:
{"type":"result","result":"No L2 files need generation"}

Return valid JSON only.`;

function buildHumanPrompt(
  summaries: Array<{ moduleName: string; count: number }>,
): string {
  const lines = ['# L2 Generation Scan', ''];
  for (const s of summaries) {
    lines.push(`Module: ${s.moduleName} — ${s.count} file(s) need generation`);
  }
  const total = summaries.reduce((n, s) => n + s.count, 0);
  lines.push('', `Total: ${total} file(s) to generate.`);
  lines.push('Confirm and return your response.');
  return lines.join('\n');
}
