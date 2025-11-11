/// <mls shortName="agentScaffoldToOrganismMock" project="102020" enhancement="_blank" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getNextFlexiblePendingStep,
    appendLongTermMemory,
    notifyTaskChange,
    updateStepStatus,
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentScaffoldToOrganismMock";
const project = 102020;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Prototype-level organism update agent to mockup organism.",
        visibility: "public",
        scope: [],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Analyzing 3...";
    if (!context || !context.message) throw new Error(`[${agentName}](_beforePrompt) Invalid context`);

    if (!context.task) {
        const inputs: any = await getPrompts();
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    context = await updateFile(context);
    notifyTaskChange(context);
    await executeNextStep(context);
}

async function getPrompts(): Promise<mls.msg.IAMessageInputType[]> {

    const data: Record<string, string> = {
        'typescript' : tsTest,
        'defs': defsTest,
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
    return prompts;
}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}] updateFile: Not found context`);
    const step = getNextFlexiblePendingStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] updateFile: Invalid step in updateFile`);
    const result: IDataResult = step.result;

    if (!result) throw new Error(`[${agentName}] updateFile: Not found "result"`);

    console.info(result.logs)
    console.info(result.typescript)

    context = await updateStepStatus(context, step.stepId, "completed");
    return context;

}

interface IDataResult {
    typescript: string,
    logs: string[],
}



const defsTest = `
/// <mls shortName="organismServiceHighlights" project="102017" folder="petshop" groupName="petshop" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 102017,
    "folder": "petshop",
    "shortName": "organismServiceHighlights",
    "type": "organism",
    "devFidelity": "scaffold",
    "group": "petshop",
    "tags": [
      "lit",
      "organism"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": []
  },
  "planning": {
    "generalDescription": "Destaques de serviços na home.",
    "goal": "Mostrar serviços como banho e tosa com descrições.",
    "userStories": [
      {
        "story": "Como dono de pet, quero ver serviços disponíveis para agendar.",
        "derivedRequirements": [
          {
            "description": "Incluir botão de agendamento.",
            "comment": "Direcionar para página de agendamento."
          }
        ]
      }
    ],
    "userRequestsEnhancements": [],
    "constraints": []
  }
}

`

const tsTest = `
/// <mls shortName="organismServiceHighlights" project="102017" folder="petshop" enhancement="_100554_enhancementLit" groupName="petshop" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaOrganismBase } from '_100554_icaOrganismBase';

@customElement('petshop--organism-service-highlights-102017')
export class organismServiceHighlights extends IcaOrganismBase {
    render(){
        return html\`<div class="services-container" id="petshop--service-highlights-102017-1">
    <h2 class="services-title" id="petshop--service-highlights-102017-2">Destaques de Serviços</h2>
    <div class="services-grid" id="petshop--service-highlights-102017-3">
      <div class="service-item" id="petshop--service-highlights-102017-4">
        <img src="https://images.unsplash.com/photo-1647002380358-fc70ed2f04e0?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHxkb2clMjBnZXR0aW5nJTIwYSUyMGJhdGglMjBhbmQlMjBncm9vbWluZ3xlbnwwfHx8fDE3NjI3OTUwMzF8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Banho e tosa para pets" class="service-image" id="petshop--service-highlights-102017-5">
        <h3 class="service-name" id="petshop--service-highlights-102017-6">Banho e Tosa</h3>
        <p class="service-description" id="petshop--service-highlights-102017-7">Deixe seu pet limpo e estiloso com nossos serviços profissionais.</p>
        <a href="#" class="service-cta" id="petshop--service-highlights-102017-8">Agendar Agora</a>
      </div>
      <div class="service-item" id="petshop--service-highlights-102017-9">
        <img src="https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w2NDU4NjB8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBhJTIwcGV0fGVufDB8fHx8MTc2Mjc5NTAzMXww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Consulta veterinária" class="service-image" id="petshop--service-highlights-102017-10">
        <h3 class="service-name" id="petshop--service-highlights-102017-11">Consulta Veterinária</h3>
        <p class="service-description" id="petshop--service-highlights-102017-12">Cuidado completo com veterinários parceiros.</p>
        <a href="#" class="service-cta" id="petshop--service-highlights-102017-13">Agendar Agora</a>
      </div>
    </div>
  </div>
\`
    }
}

`
