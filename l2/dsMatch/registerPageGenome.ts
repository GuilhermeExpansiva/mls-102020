/// <mls fileReference="_102020_/l2/dsMatch/registerPageGenome.ts" enhancement="_blank" />

// Terminal step of a DS derivation: register the new page variation in the module's
// `module.ts` moduleGenome. Module-level + ONCE + deterministic (no LLM). Triggered
// by the DerivationTracker when all pages finished (Fase 2 / agentGenDefs).
//
// NOTE: the page folder uses indices (page{layout}{ds}); the genome VALUE uses NAMES
// (designSystems[ds].name, layouts[layout].name) read from project.json.
//
// The module.ts file does not exist in the repo yet, so the in-place edit path is
// best-effort (uses defsAST.updateVariableJson). buildGenomeEntry is pure/tested.

import { getConfigProject } from '/_102027_/l2/libProjectConfig.js';
import { getVariableJson, updateVariableJson } from '/_102027_/l2/defsAST.js';
import { createStorFile, IReqCreateStorFile } from '/_102027_/l2/libStor.js';
import { DEFAULT_DEVICE } from '/_102020_/l2/dsMatch/derivePaths.js';

export interface GenomeEntry {
    key: string;                       // 'web/desktop/page12'
    value: { designSystem: string; device: string; layout: string };
}

/** Pure: build the moduleGenome entry for a variation. */
export function buildGenomeEntry(
    layout: number | string,
    ds: number | string,
    dsName: string,
    layoutName: string,
    device = DEFAULT_DEVICE,
): GenomeEntry {
    return {
        key: `web/${device}/page${layout}${ds}`,
        value: { designSystem: dsName, device, layout: layoutName },
    };
}

/**
 * Read/ensure the moduleGenome entry for page{layout}{ds} in {module}/module.ts.
 * Idempotent. Creates module.ts from a template if it does not exist yet.
 */
export async function registerPageGenome(
    project: number,
    module: string,
    layout: number | string,
    ds: number | string,
    device = DEFAULT_DEVICE,
): Promise<GenomeEntry> {

    const config: any = await getConfigProject(project);
    const dsName = config?.designSystems?.[String(ds)]?.name ?? String(ds);
    const layoutName = config?.layouts?.[String(layout)]?.name ?? String(layout);

    const entry = buildGenomeEntry(layout, ds, dsName, layoutName, device);
    const moduleRef = `_${project}_/l2/${module}/module.ts`;

    const existingSrc = await readSource(moduleRef);

    let newSrc: string;
    if (!existingSrc) {
        // No module.ts yet → create from a minimal template carrying this entry.
        newSrc = moduleTemplate(moduleRef, { [entry.key]: entry.value });
    } else {
        const genome = safeGetGenome(existingSrc);
        genome[entry.key] = entry.value; // idempotent
        newSrc = updateVariableJson(existingSrc, 'moduleGenome', genome);
    }

    await saveFile(moduleRef, newSrc);
    console.info(`[registerPageGenome] registered ${entry.key} → ${JSON.stringify(entry.value)} in ${moduleRef}`);
    return entry;
}

// ─── helpers ──────────────────────────────────────────────────────────────

function safeGetGenome(src: string): Record<string, any> {
    try {
        const g = getVariableJson<Record<string, any>>(src, 'moduleGenome');
        return (g && typeof g === 'object') ? g : {};
    } catch {
        return {};
    }
}

function moduleTemplate(moduleRef: string, genome: Record<string, any>): string {
    const cleanRef = moduleRef.startsWith('/') ? moduleRef.slice(1) : moduleRef;
    return [
        `/// <mls fileReference="${cleanRef}" enhancement="_blank" />`,
        '',
        `import type { AuraModuleFrontendDefinition, IPaths, ISkill, IGenomeConfig } from '/_102029_/l2/contracts/bootstrap.js';`,
        '',
        `export const moduleGenome: Record<string, IGenomeConfig> = ${JSON.stringify(genome, null, 2)} as const;`,
        '',
    ].join('\n');
}

async function readSource(ref: string): Promise<string> {
    const norm = ref.startsWith('/') ? ref.slice(1) : ref;
    const info = mls.stor.convertFileReferenceToFile(norm);
    const key = mls.stor.getKeyToFile(info);
    const sf = mls.stor.files[key];
    if (!sf) return '';
    const content = await sf.getContent();
    return typeof content === 'string' ? content : '';
}

async function saveFile(ref: string, src: string): Promise<void> {
    const info = mls.stor.convertFileReferenceToFile(ref);
    const key = mls.stor.getKeyToFile(info);
    let sf = mls.stor.files[key];
    if (!sf) {
        const param: IReqCreateStorFile = { ...info, source: src };
        sf = await createStorFile(param, true, true, true);
    } else {
        const m = await sf.getOrCreateModel();
        if (m && m.model) m.model.setValue(src);
    }
    await mls.stor.localStor.setContent(sf, { contentType: 'string', content: src });
}
