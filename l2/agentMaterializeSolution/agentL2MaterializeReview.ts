/// <mls fileReference="_102020_/l2/agentMaterializeSolution/agentL2MaterializeReview.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { createStorFile, IReqCreateStorFile } from '/_102027_/l2/libStor.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: 'agentL2MaterializeReview',
    agentProject: 102020,
    agentFolder: 'agentMaterializeSolution',
    agentDescription: 'Review generated contract, shared and page files against their definitions',
    visibility: 'public',
    beforePromptImplicit,
    beforePromptStep,
    afterPromptStep,
  };
}

// ─── input ────────────────────────────────────────────────────────────────────

interface AgentInput {
  moduleName: string;
  pathContractDefs: string;
  pathSharedDefs: string;
  pathPageDefs: string;
  pathContract: string;
  pathShared: string;
  pathPage: string;
}

function parseInput(raw: string): AgentInput {
  const parsed = JSON.parse(raw.trim()) as Record<string, unknown>;
  const required: (keyof AgentInput)[] = ['moduleName', 'pathContractDefs', 'pathSharedDefs', 'pathPageDefs', 'pathContract', 'pathShared', 'pathPage'];
  for (const key of required) {
    if (typeof parsed[key] !== 'string' || !parsed[key]) throw new Error(`[agentL2MaterializeReview] missing "${key}"`);
  }
  return parsed as unknown as AgentInput;
}

// ─── stor helpers ─────────────────────────────────────────────────────────────

function toRef(mlsPath: string): string {
  const norm = mlsPath.trim().replace(/^\/+/, '');
  const m = norm.match(/^mls-(\d+)\/(.+)/);
  if (m) return `_${m[1]}_/${m[2]}`;
  return norm;
}

async function readStorFile(mlsPath: string): Promise<string> {
  const info = mls.stor.convertFileReferenceToFile(toRef(mlsPath));
  if (!info) throw new Error(`[agentL2MaterializeReview] cannot resolve: ${mlsPath}`);
  const sf = mls.stor.files[mls.stor.getKeyToFile(info)];
  if (!sf) throw new Error(`[agentL2MaterializeReview] file not found: ${mlsPath}`);
  const content = await sf.getContent();
  if (typeof content !== 'string') throw new Error(`[agentL2MaterializeReview] non-string content: ${mlsPath}`);
  return content;
}

async function writeStorFile(mlsPath: string, src: string): Promise<void> {
  const info = mls.stor.convertFileReferenceToFile(toRef(mlsPath));
  if (!info) throw new Error(`[agentL2MaterializeReview] cannot resolve: ${mlsPath}`);
  const key = mls.stor.getKeyToFile(info);
  let sf = mls.stor.files[key];
  if (!sf) {
    const param: IReqCreateStorFile = { ...info, source: src };
    sf = await createStorFile(param, false, false, false);
  } else {
    const m = await sf.getOrCreateModel();
    if (m && m.model) m.model.setValue(src);
  }
  await mls.stor.localStor.setContent(sf, { contentType: 'string', content: src });
}

// ─── prompt builder ───────────────────────────────────────────────────────────

async function buildHumanPrompt(input: AgentInput): Promise<string> {
  const [
    srcContractDefs,
    srcSharedDefs,
    srcPageDefs,
    srcContract,
    srcShared,
    srcPage,
  ] = await Promise.all([
    readStorFile(input.pathContractDefs),
    readStorFile(input.pathSharedDefs),
    readStorFile(input.pathPageDefs),
    readStorFile(input.pathContract),
    readStorFile(input.pathShared),
    readStorFile(input.pathPage),
  ]);

  return [
    `## moduleName\n${input.moduleName}`,
    `## pathContractDefs\n${input.pathContractDefs}`,
    `## pathSharedDefs\n${input.pathSharedDefs}`,
    `## pathPageDefs\n${input.pathPageDefs}`,
    `## pathContract\n${input.pathContract}`,
    `## pathShared\n${input.pathShared}`,
    `## pathPage\n${input.pathPage}`,
    `## srcContractDefs\n\`\`\`ts\n${srcContractDefs}\n\`\`\``,
    `## srcSharedDefs\n\`\`\`ts\n${srcSharedDefs}\n\`\`\``,
    `## srcPageDefs\n\`\`\`ts\n${srcPageDefs}\n\`\`\``,
    `## srcContract\n\`\`\`ts\n${srcContract}\n\`\`\``,
    `## srcShared\n\`\`\`ts\n${srcShared}\n\`\`\``,
    `## srcPage\n\`\`\`ts\n${srcPage}\n\`\`\``,
  ].join('\n\n');
}

// ─── beforePromptImplicit ─────────────────────────────────────────────────────

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {
  const input = parseInput(userPrompt);
  const humanPrompt = await buildHumanPrompt(input);

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: 'add-message-ai',
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [
        { type: 'system', content: systemPrompt },
        { type: 'human', content: humanPrompt },
      ],
      taskTitle: `review:${input.moduleName}`,
      threadId: context.message.threadId,
      userMessage: userPrompt,
      longTermMemory: { moduleName: input.moduleName },
    },
  };

  return [addMessageAI];
}

// ─── beforePromptStep ─────────────────────────────────────────────────────────

async function beforePromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  _step: mls.msg.AIAgentStep,
  hookSequential: number,
  args?: string,
): Promise<mls.msg.AgentIntent[]> {
  if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args is required`);

  const input = parseInput(args);
  const humanPrompt = await buildHumanPrompt(input);

  const promptReady: mls.msg.AgentIntentPromptReady = {
    type: 'prompt_ready',
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt,
    systemPrompt,
  };

  return [promptReady];
}

// ─── afterPromptStep ──────────────────────────────────────────────────────────

async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
  if (!agent || !context || !step) throw new Error(`(${agent.agentName})[afterPromptStep] invalid params`);

  let status: mls.msg.AIStepStatus = 'completed';

  try {
    const payload = step.interaction?.payload?.[0];
    if (!payload || payload.type !== 'flexible' || !payload.result) throw new Error('missing or invalid flexible payload');

    const result = payload.result as AgentOutput['result'];

    if (result.srcContract !== 'ok') await writeStorFile(result.pathContract, result.srcContract);
    if (result.srcShared !== 'ok') await writeStorFile(result.pathShared, result.srcShared);
    if (result.srcPage !== 'ok') await writeStorFile(result.pathPage, result.srcPage);

  } catch (err) {
    status = 'failed';
    console.error(`[agentL2MaterializeReview](afterPromptStep)`, err);
  }

  const updateStatus: mls.msg.AgentIntentUpdateStatus = {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep.stepId,
    stepId: step.stepId,
    cleaner: 'input_output',
    status,
  };

  return [updateStatus];
}

// ─── system prompt ────────────────────────────────────────────────────────────

const systemPrompt = `
<!-- modelType: geminiChat -->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

You are agentL2MaterializeReview.
You receive three generated TypeScript files (contract, shared, page) and their three definition files.
Review the generated files for correctness and return a structured result.

## What to check

### Contract (## srcContract vs ## srcContractDefs)
- All TypeScript interfaces are valid and match the definition exactly (no missing, no extra fields)
- Correct export names and types

### Shared (## srcShared vs ## srcSharedDefs)
- Imports and uses the contract interfaces correctly (types match, no wrong property access)
- All methods and actions described in the definition are implemented
- No references to non-existent members from the contract

### Page (## srcPage vs ## srcPageDefs)
- The custom element tag name is written in correct kebab-case and matches the file path in ## pathPage
- Extends or uses the shared base class correctly
- All navigation refs from the definition are wired up
- No references to non-existent members from shared

### Cross-file consistency
- Interfaces from contract are used with correct types in shared
- Methods/properties exposed by shared are used correctly in page
- All generated content matches what was specified in the definition files

## Decision rule per file
- Correct with no changes needed → set the src field to the string "ok"
- Has issues → set the src field to the COMPLETE corrected source as a compact JSON string (full file, not a diff or snippet)

## Output format
The src values that are not "ok" must be single-line JSON strings.
Escape ALL special characters inside them:
  - newlines     → \\n
  - tabs         → \\t
  - double quotes → \\"
  - backslashes  → \\\\

Return ONLY valid JSON, no markdown fences, no prose.

[[OutputSection]]

Both pathXxx fields must echo the values from ## pathContract, ## pathShared and ## pathPage exactly.
`;

//#region OutputSection
export type AgentOutput = {
  type: 'flexible';
  result: {
    pathContract: string; // echo ## pathContract
    srcContract: string;  // 'ok' or full corrected source as compact JSON string
    pathShared: string;   // echo ## pathShared
    srcShared: string;    // 'ok' or full corrected source as compact JSON string
    pathPage: string;     // echo ## pathPage
    srcPage: string;      // 'ok' or full corrected source as compact JSON string
  };
};
//#endregion
