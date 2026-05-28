/// <mls fileReference="_102020_/l2/agents/newModule/agentInitializeMock.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { createStorFile, IReqCreateStorFile } from '/_102027_/l2/libStor.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentInitializeMock",
    agentProject: 102020,
    agentFolder: "agents/newModule",
    agentDescription: "Generate mock file from ontology",
    visibility: "public",
    beforePromptImplicit,
    beforePromptStep,
    afterPromptStep
  };
}

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (!userPrompt || userPrompt.length < 2) throw new Error('invalid prompt');

  const info = JSON.parse(userPrompt) as { moduleName: string };
  const moduleName = info.moduleName || context.task?.iaCompressed?.longMemory['moduleName'] as string;
  const project = mls.actualProject || 0;
  const ontology = await getOntology(moduleName);

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [
        { type: 'system', content: system1 },
        { type: 'human', content: buildHumanPrompt(project, moduleName, ontology) }
      ],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: { moduleName }
    }
  };
  return [addMessageAI];

}

async function beforePromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  args?: string
): Promise<mls.msg.AgentIntent[]> {

  if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args invalid`);

  const moduleName = context.task?.iaCompressed?.longMemory['moduleName'] as string;
  if (!moduleName) throw new Error('[agentInitializeMock] moduleName not found');

  const project = mls.actualProject || 0;
  const ontology = await getOntology(moduleName);

  const continueIntent: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: buildHumanPrompt(project, moduleName, ontology),
    systemPrompt: system1
  };
  return [continueIntent];

}

async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {

  if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params`);

  const payload = step.interaction?.payload?.[0];
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload`);

  const moduleName = context.task?.iaCompressed?.longMemory['moduleName'] as string;
  if (!moduleName) throw new Error('[agentInitializeMock] moduleName not found');

  await saveFile(`_${mls.actualProject}_/l1/${moduleName}/layer_2_controllers/mock.ts`, payload.result.srcFile);

  const updateStatus: mls.msg.AgentIntentUpdateStatus = {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep.stepId,
    stepId: step.stepId,
    status: 'completed'
  };
  return [updateStatus];

}

function buildHumanPrompt(projectId: number, moduleName: string, ontology: string): string {
  const outputPath = `/l1/${moduleName}/layer_2_controllers/mock.ts`;
  const userInfo = { projectId, moduleName, outputPath };
  return `## Ontology\n${ontology}\n\n## User info\n${JSON.stringify(userInfo, null, 2)}`;
}

async function getOntology(moduleName: string): Promise<string> {
  const key = mls.stor.getKeyToFile({
    project: mls.actualProject || 0,
    level: 2,
    shortName: 'module',
    folder: moduleName,
    extension: '.defs.ts'
  });
  if (!mls.stor.files[key]) throw new Error('[agentInitializeMock] ontology file not found');
  return await mls.stor.files[key].getContent() as string;
}

async function saveFile(ref: string, src: string) {
  const info = mls.stor.convertFileReferenceToFile(ref);
  const k = mls.stor.getKeyToFile(info);
  let sf = mls.stor.files[k];

  if (!sf) {
    const param: IReqCreateStorFile = { ...info, source: src };
    sf = await createStorFile(param, true, true, true);
  } else {
    const m = await sf.getOrCreateModel();
    if (m && m.model) m.model.setValue(src);
  }

  await mls.stor.localStor.setContent(sf, { contentType: 'string', content: src });
}

const system1 = `
<!-- modelType: codeinstruct -->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

#SKILL: Mock Generator
You generate a single TypeScript mock.ts file from a module ontology.
You are a mechanical transformer. You do not add, infer, or complete anything beyond what is explicitly written in the ontology.

##Your only job
Read the ontology. For each entity, generate: a store entry in mockStore and a repository function. Stop.
You do NOT:
- Add fields not listed in the ontology
- Rename anything
- Import type contracts (they do not exist yet at this stage)
- Use anything other than \`any\` for typed positions on mock data

---

## What you receive

You receive:
- The \`ontology\` export from \`module.defs.ts\`, specifically the entries under \`ontology.ontology.entities\`
- A user info object with \`projectId\`, \`moduleName\`, \`outputPath\`

---

## Triple Slash (Mandatory)

First line of the file, always:
\`\`\`ts
/// <mls fileReference="_{projectId}_/{outputPath without leading /}" enhancement="_blank" />
\`\`\`

Example — given \`{ "projectId": 102035, "outputPath": "/l1/pizzaria/layer_2_controllers/mock.ts" }\`:
\`\`\`ts
/// <mls fileReference="_102035_/l1/pizzaria/layer_2_controllers/mock.ts" enhancement="_blank" />
\`\`\`

---

## Derived names — compute once per entity, use everywhere

For each entity entry \`(entityName, entityDef)\` in \`ontology.ontology.entities\`:

| Derived name | Rule | Example (entityName = Caixa, moduleName = pizzaria) |
|---|---|---|
| \`repositoryName\` | \`moduleName\` + firstChar(entityName).toLowerCase() + entityName.slice(1) | \`pizzariaCaixa\` |
| \`primaryKeyField\` | Name of the FIRST key listed in \`entityDef.fields\` | \`data\` |
| \`fnName\` | \`getMock\` + entityName + \`Repository\` | \`getMockCaixaRepository\` |

---

## STEP 1 — USE_MOCK flag

Emit exactly:
\`\`\`typescript
export const USE_MOCK = true;
\`\`\`

---

## STEP 2 — mockStore

Emit a single \`const mockStore\` object. One key per entity in the order they appear in the ontology.
- Key: \`repositoryName\`
- Value: array literal with exactly 2 seed records, suffixed with \`as any[]\`
- Include ALL fields (required AND optional) in both records

### Seed value rules — apply the FIRST matching rule

| Condition on the field | Value for record 1 | Value for record 2 |
|---|---|---|
| exact name \`id\`, OR name ends with \`Id\` and type is \`string\` | \`'id-001'\` | \`'id-002'\` |
| type is \`date\` OR exact name \`data\` | \`'2026-05-28'\` | \`'2026-05-27'\` |
| type is \`datetime\` OR name is \`dataHora\` OR name ends with \`Hora\` | \`'2026-05-28T08:00:00Z'\` | \`'2026-05-27T14:30:00Z'\` |
| name ends with \`valor\`, \`Valor\`, \`preco\`, \`Preco\`, \`taxa\`, \`Taxa\` | \`200\` | \`150\` |
| name ends with \`quantidade\`, \`Quantidade\`, or \`Min\` | \`10\` | \`5\` |
| type is \`boolean\` | \`true\` | \`false\` |
| field has \`values\` array (enum) | \`values[0]\` | \`values[1]\` (or \`values[0]\` if only one exists) |
| type is \`array\` | \`[]\` | \`[]\` |
| anything else | \`'exemplo 1'\` | \`'exemplo 2'\` |

Emit:
\`\`\`typescript
const mockStore = {
  {repositoryName}: [
    { {field1}: {seed1}, {field2}: {seed2}, ... },
    { {field1}: {seed1alt}, {field2}: {seed2alt}, ... },
  ] as any[],
  // one entry per entity in ontology order
};
\`\`\`

Each seed record must be on a single line (no multi-line object literals inside the array).

---

## STEP 3 — Repository functions

For each entity, emit one exported function. Order must match mockStore entries.

Template (substitute \`{fnName}\`, \`{repositoryName}\`, \`{primaryKeyField}\` with derived values):
\`\`\`typescript
export function {fnName}() {
  const store = mockStore.{repositoryName};
  return {
    async findMany(): Promise<any[]> {
      return store;
    },
    async findOne({ where }: { where: Record<string, any> }): Promise<any> {
      return store.find((item: any) =>
        Object.entries(where).every(([k, v]) => (item as Record<string, any>)[k] === v)
      );
    },
    async upsert({ record }: { record: any }): Promise<void> {
      const idx = store.findIndex((item: any) => item.{primaryKeyField} === record.{primaryKeyField});
      if (idx >= 0) store[idx] = record;
      else store.push(record);
    },
  };
}
\`\`\`

---

## Final file structure

Assemble in this exact order:

\`\`\`typescript
/// <mls fileReference="..." enhancement="_blank" />

export const USE_MOCK = true;

const mockStore = {
  // STEP 2 — one entry per entity
};

// STEP 3 — one function per entity, same order as mockStore
\`\`\`

## Formatting rules
- 2-space indentation
- One blank line between top-level declarations
- mockStore: each entity key on its own line block; seed records stay on one line each
- No type imports — file is fully self-contained with \`any\` throughout
- No comments explaining domain or field semantics

---

You must return ONLY a valid JSON object. No preamble, no explanation, no markdown
fences, no text before or after the JSON. Start your response with { and end with }

## Output format
The srcFile value must be a single-line JSON string.
Escape ALL special characters inside it:
  - newlines     → \\n
  - tabs         → \\t
  - double quotes → \\"
  - backslashes  → \\\\
Never embed raw multiline code blocks inside a JSON string value.

Return strictly this structure:

[[OutputSection]]

`;

//#region OutputSection
export type Output = {
  type: "flexible";
  result: {
    srcFile: string;
  };
};
//#endregion
