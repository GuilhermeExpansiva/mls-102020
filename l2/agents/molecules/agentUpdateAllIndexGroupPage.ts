/// <mls fileReference="_102020_/l2/agents/molecules/agentUpdateAllIndexGroupPage.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { skills as skillList } from '/_102020_/l2/skills/molecules/index';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentUpdateAllIndexGroupPage",
        agentProject: 102020,
        agentFolder: "agents",
        agentDescription: "Runs agentIndexGroupPage for every molecule group in the skills index",
        visibility: "public",
        beforePromptImplicit,
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!mls.actualProject) throw new Error(`(${agent.agentName})[beforePromptImplicit] project invalid`);

    const targetGroups = resolveTargetGroups(agent.agentName, userPrompt);

    const eligibleGroups = targetGroups.filter((group) => {
        const hasMolecules = getMoleculeFiles(group).length > 0;
        if (!hasMolecules) console.warn(`(${agent.agentName}) skipping ${group}: no molecules found in storage`);
        return hasMolecules;
    });

    if (eligibleGroups.length === 0)
        throw new Error(`(${agent.agentName})[beforePromptImplicit] no eligible groups found to update`);

    return eligibleGroups.map((group): mls.msg.AgentIntentAddStep => ({
        type: 'add-step',
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: 1,
        stepTitle: `Index page: ${group}`,
        step: {
            type: 'agent',
            stepId: 0,
            interaction: null,
            status: 'waiting_human_input',
            nextSteps: [],
            agentName: 'agentIndexGroupPage',
            prompt: group,
            rags: null,
        },
    }));
}

// =========================================================================== HELPERS

function resolveTargetGroups(agentName: string, userPrompt: string): string[] {
    const raw = (userPrompt || '').trim().toLowerCase();

    if (!raw || raw === 'all') {
        return skillList.map((s) => s.name);
    }

    const requested = raw.split(',').map((s) => s.trim()).filter(Boolean);
    const unknown = requested.filter((r) => !skillList.find((s) => s.name.toLowerCase() === r));

    if (unknown.length > 0)
        throw new Error(`(${agentName})[resolveTargetGroups] unknown groups: ${unknown.join(', ')}. Available: ${skillList.map((s) => s.name).join(', ')}`);

    return requested.map((r) => skillList.find((s) => s.name.toLowerCase() === r)!.name);
}

function getMoleculeFiles(group: string): string[] {
    const groupFolder = `molecules/${group.toLowerCase()}`;
    return Object.keys(mls.stor.files)
        .map((key) => mls.stor.files[key])
        .filter((sf) =>
            sf.project === mls.actualProject &&
            sf.extension === '.ts' &&
            sf.folder === groupFolder &&
            sf.shortName !== 'index'
        )
        .map((sf) => sf.shortName);
}
