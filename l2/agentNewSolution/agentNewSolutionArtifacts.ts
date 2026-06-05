/// <mls fileReference="_102020_/l2/agentNewSolution/agentNewSolutionArtifacts.ts" enhancement="_102027_/l2/enhancementAgent"/>

import { createStorFile } from '/_102027_/l2/libStor.js';
import { getAgentStepByAgentName } from '/_102027_/l2/aiAgentHelper.js';

export interface NewSolutionInitialArtifactInfo {
  moduleName?: string;
  requestKind?: string;
  userLanguage?: string;
  userPrompt?: string;
}

export function normalizeModuleFolderName(value: unknown, fallback: string = 'module'): string {
  const source = `${typeof value === 'string' && value.trim() ? value : fallback}` || 'module';
  const ascii = source
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim();
  const words = ascii.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'module';

  const camel = words.map((word, index) => {
    const lower = word.toLowerCase();
    if (index === 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');

  const withoutLeadingDigits = camel.replace(/^[0-9]+/, '');
  return (withoutLeadingDigits || 'module').slice(0, 60);
}

export function reserveAvailableModuleName(requestedName: unknown, fallbackPrompt: string): string {
  const baseName = normalizeModuleFolderName(requestedName, fallbackPrompt);
  const folders = getExistingModuleFolders();

  if (!hasFolder(folders, baseName)) return baseName;

  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${baseName}${index}`;
    if (!hasFolder(folders, candidate)) return candidate;
  }

  throw new Error(`[reserveAvailableModuleName] no available folder name for ${baseName}`);
}

export async function reserveNewSolutionModuleArtifacts(initial: NewSolutionInitialArtifactInfo): Promise<void> {
  const moduleName = normalizeModuleFolderName(initial.moduleName, initial.userPrompt || 'module');
  const source = `export const initial = ${JSON.stringify({
    moduleName,
    requestKind: initial.requestKind || 'module_solution',
    userLanguage: initial.userLanguage || 'pt-BR',
    userPrompt: initial.userPrompt || '',
    createdAt: new Date().toISOString(),
  }, null, 2)} as const;\n`;

  await saveStorContent({
    project: mls.actualProject || 0,
    level: 2,
    folder: moduleName,
    shortName: 'module',
    extension: '.defs.ts',
  }, source, false);
}

export async function saveNewSolutionAgentTracePayload(
  context: mls.msg.ExecutionContext,
  agentName: string,
  step: mls.msg.AIAgentStep,
  moduleNameOverride?: string,
): Promise<void> {
  try {
    const payload = step.interaction?.payload?.[0];
    if (!payload) return;

    const moduleName = normalizeModuleFolderName(moduleNameOverride || getInitialModuleName(context), 'module');
    const trace = {
      savedAt: new Date().toISOString(),
      agentName,
      stepId: step.stepId,
      planning: (step as any).planning || null,
      status: step.status,
      payload,
    };

    await saveStorContent({
      project: mls.actualProject || 0,
      level: 2,
      folder: `${moduleName}/trace`,
      shortName: getTraceShortName(agentName, step.stepId),
      extension: '.json',
    }, JSON.stringify(trace, null, 2), false);
  } catch (error) {
    console.warn(`[saveNewSolutionAgentTracePayload] failed for ${agentName}`, error);
  }
}

function getInitialModuleName(context: mls.msg.ExecutionContext): string {
  if (!context.task) return 'module';
  const agentStep = getAgentStepByAgentName(context.task, 'agentNewSolution') as mls.msg.AIAgentStep | null;
  const payload = agentStep?.interaction?.payload?.[0] as mls.msg.AIFlexibleResultStep | undefined;
  const result = payload?.type === 'flexible' && payload.result && typeof payload.result === 'object'
    ? payload.result as NewSolutionInitialArtifactInfo
    : undefined;

  return result?.moduleName || normalizeModuleFolderName(undefined, result?.userPrompt || 'module');
}

function getExistingModuleFolders(): Set<string> {
  const actualProject = mls.actualProject || 0;
  const folders = Object.values(mls.stor.files)
    .filter(f => f.project === actualProject && f.level !== 3 && f.folder)
    .map(f => f.folder);

  return new Set(folders);
}

function hasFolder(folders: Set<string>, folder: string): boolean {
  for (const item of folders) {
    if (item === folder || item.startsWith(`${folder}/`)) return true;
  }
  return false;
}

function getTraceShortName(agentName: string, stepId: number): string {
  const safeAgentName = agentName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `${String(stepId).padStart(3, '0')}-${safeAgentName || 'agent'}`;
}

async function saveStorContent(
  fileInfo: Pick<mls.stor.IFileInfo, 'project' | 'level' | 'folder' | 'shortName' | 'extension'>,
  source: string,
  needCreateModel: boolean,
): Promise<void> {
  const key = mls.stor.getKeyToFile(fileInfo);
  let storFile = mls.stor.files[key];

  if (!storFile) {
    storFile = await createStorFile({ ...fileInfo, source }, needCreateModel, needCreateModel, false);
  } else if (needCreateModel) {
    const model = await storFile.getOrCreateModel();
    if (model?.model) model.model.setValue(source);
  }

  await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: source });
}
