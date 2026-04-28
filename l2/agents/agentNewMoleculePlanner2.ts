/// <mls fileReference="_102020_/l2/agents/agentNewMoleculePlanner2.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>


import { skill as skillMolecule } from '/_102020_/l2/skills/aura/moleculeGeneration2.js';
import { finishClarification } from "/_102027_/l2/aiAgentOrchestration.js";
import { skills as skillList } from '/_102020_/l2/skills/molecules/index';

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { ClarificationData } from '/_102020_/l2/agents/agentNewMoleculePlannerClarification.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentNewMoleculePlanner2",
        agentProject: 102020,
        agentFolder: "agents",
        agentDescription: "Agent Planner for a new moleculle",
        visibility: "private",
        beforePromptImplicit,
        beforePromptStep,
        afterPromptStep,
        beforeClarificationStep
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const baseMolecule = await getBaseMolecule();
    const groupDetails = skillList.find((item) => item.name === userPrompt);

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system1
                    .replace("{{ group }}", userPrompt)
                    .replace("{{ skillMolecule }}", skillMolecule)
                    .replace("{{ groupDesc }}", groupDetails?.description || '')
                    .replace("{{systemBaseMolecule}}", baseMolecule)

            }, {
                type: "human",
                content: context.message.content
            }],
            taskTitle: `Planner...`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
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
    if(!mls.actualProject) throw new Error(`(${agent.agentName})[beforePromptStep] project invalid: ${mls.actualProject}`);
    const data: { group: string, prompt: string } = JSON.parse(args)

    const baseMolecule = await getBaseMolecule();
    const groupDetails = skillList.find((item) => item.name === data.group);
    const skillByGroup = await getGroupSkill(data.group);

    const continueIntent: mls.msg.AgentIntentPromptReady = {
        type: "prompt_ready",
        args,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        hookSequential,
        parentStepId: parentStep.stepId,
        humanPrompt: data.prompt || '',
        systemPrompt: system1
            .replace("{{ group }}", data.group)
            .replace("{{project}}", mls.actualProject?.toString())
            .replace("{{ skillMolecule }}", skillMolecule)
            .replace("{{ groupSkill }}", skillByGroup)
            .replace("{{systemBaseMolecule}}", baseMolecule)
    }

    return [continueIntent];
}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {


    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    const payload = (step.interaction?.payload?.[0]);
    if (payload?.type !== 'clarification' || !payload.json) throw new Error(`[afterPromptStep] invalid payload: ${payload}`);
    if (context.isTest) { console.info(payload.json) }

    return [];

}

async function beforeClarificationStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIClarificationStep,
    hookSequential: number,
    json: ClarificationData
): Promise<HTMLElement> {

    if (!context.task) throw new Error(`[beforeClarificationStep] invalid task: undefined`)

    const intentsToClarification: mls.msg.AgentIntent[] = processOutput(agent, context, parentStep, step, hookSequential, json);
    await import('/_102020_/l2/agents/agentNewMoleculePlannerClarification.js');
    const clariEl = document.createElement('agents--agent-new-molecule-planner-clarification-102020');
    (clariEl as any).data = json;

    clariEl.addEventListener('clarification-finish', (e: Event) => {
        const { detail } = e as CustomEvent<{ value: unknown; action: "continue" | "cancel" }>;
        const { value, action } = detail;
        const normalizedValue = `\`\`\`json \n ${JSON.stringify(value, null, 2)} \n \`\`\``

        finishClarification(
            agent,
            step.stepId,
            parentStep.stepId,
            intentsToClarification,
            context,
            normalizedValue,
            action
        );
    });

    return clariEl;

}
function processOutput(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIClarificationStep,
    hookSequential: number,
    suggestions: ClarificationData
): mls.msg.AgentIntent[] {

    console.log("processOutput === Suggestions")
    console.log(JSON.stringify(suggestions, null, 2));

    let status: mls.msg.AIStepStatus = 'completed';

    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };

    const updateStatusAgent: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: 1,
        stepId: parentStep.stepId,
        status: 'completed'
    };

    const newStep: mls.msg.AgentIntentAddStep = {
        type: "add-step",
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: 1,
        stepTitle: 'Preparing defs',
        step:
        {
            type: 'agent',
            stepId: 0,
            interaction: null,
            status: 'waiting_human_input',
            nextSteps: [],
            agentName: "agentNewMoleculeDefs",
            prompt: `{{clarification}}`,
            rags: null,
        }
    };

    const intents: mls.msg.AgentIntent[] = [newStep, updateStatusAgent, updateStatus];
    return intents;


}
async function getGroupSkill(group: string) {
    const path = skillList.find((item) => item.name === group)?.skillReference;
    if (!path) throw new Error(`[getGroupSkill] skill for group not found: ${path}`);
    const module = await import(path);
    if (!module || !module.skill) throw new Error(`[getGroupSkill] skill for group not found: ${path}`);
    if (typeof module.skill !== 'string') throw new Error(`[getGroupSkill] invalid type of skill: ${path}, must be string`);
    return module.skill;
}

async function getBaseMolecule() {
    const key = mls.stor.getKeyToFile({ project: 102020, shortName: 'moleculeBase', folder: '', extension: '.ts', level: 2 })
    const storFile = mls.stor.files[key];
    if (!storFile) return '';
    return await storFile.getContent() as string
}

const system1 = `
<!-- modelType: codeinstruct -->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

You are a planner responsible for defining the creation details of a new web component (widget) that will be included in an HTML page.
Tasks:
Understand the purpose of the widget by analyzing the original user prompt and define technical/functional restrictions and requirements.

## IMPORTANT RULES

- You MUST NOT define implementation details.
- DO NOT mention how the component should be built.
- DO NOT suggest technologies, APIs, or patterns (e.g., shadow DOM, slots, hooks, state management, etc).
- DO NOT describe HTML structure or CSS strategies.

- Your responsibility is ONLY to define:
  - Functional requirements
  - Behavioral rules
  - Data inputs/outputs
  - User interactions

- The implementation (how it will be built) is the responsibility of the group skill.

Identify the most appropriate name for this molecule. Always suggest with prefix 'ml', ex: ml-select-dropdown
Suggest the name of molecule and put in 'fileReference'. Format: _{{project}}_/l2/[groupName]/[moleculeName].ts

## CRITICAL — GROUP CONTRACT COMPLIANCE

- The molecule MUST follow the contract defined in the group skill (creation.md).
- Properties, slot tags, and events MUST come ONLY from the group contract.
- DO NOT create new properties that are not in the group contract.
- DO NOT add domain-specific properties.
- Domain-specific content is handled by slot tags — not by custom properties.
- If the user prompt mentions specific content map that content to the existing slot tags of the group, not to new properties.

## How molecules works in collab.codes
\`\`\`md
{{ skillMolecule }}
\`\`\`

## GroupName: {{ group }}

\`\`\`md
{{ groupSkill }}
\`\`\`

## Molecule Class Base
\`\`\`typescript
{{systemBaseMolecule}}
\`\`\`

## Output format
You must return the object strictly as JSON
[[OutputSection]]
`

//#region OutputSection
export type Output =
    {
        type: "clarification";
        json: TClarification;
    }

export interface TClarification {
    fileReference: string,
    description: string,
    prompt: string, // same user prompt
    group: string,
    functionalRequirements: string[],
    visualRequirements: string[],
}
//#endregion 
