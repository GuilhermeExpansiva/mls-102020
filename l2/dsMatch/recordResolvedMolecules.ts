/// <mls fileReference="_102020_/l2/dsMatch/recordResolvedMolecules.ts" enhancement="_blank" />

// Record the DS-level molecule resolution table on the design system itself
// (designSystems[ds].resolvedMolecules), so a DS is self-documenting: which concrete
// molecule each group resolves to, plus matched/fallback and the source project.
//
// This is MODULE-AGNOSTIC: it is a pure function of (DS rules + molecule catalog), so
// it can be computed when the DS is created/edited — it does not need a derivation run.
// A `catalogVersion` signature is stored alongside so staleness can be detected when the
// molecule catalog changes (recompute when it differs).

import { readDsRules } from '/_102020_/l2/dsMatch/readDsRules.js';
import { buildMoleculeCatalog } from '/_102020_/l2/dsMatch/buildMoleculeCatalog.js';
import { resolveMolecules, persistResolvedMolecules, type ResolvedMolecules } from '/_102020_/l2/dsMatch/resolveMolecules.js';
import type { MoleculeCatalogEntry } from '/_102020_/l2/dsMatch/types.js';

export interface DsResolution {
    resolvedMolecules: ResolvedMolecules;
    catalogVersion: string;
}

/**
 * Pure: deterministic signature of the catalog (count + hash of tag+layoutConfig).
 * Changes whenever a molecule is added/removed or its candidacy (layoutConfig) changes.
 */
export function catalogSignature(catalog: MoleculeCatalogEntry[]): string {
    const serialized = [...catalog]
        .map(m => `${m.project}|${m.group}|${m.tag}|${JSON.stringify(sortedAxes(m.layoutConfig))}`)
        .sort()
        .join('\n');
    return `${catalog.length}-${hash(serialized)}`;
}

/** Pure: build the DS-level resolution (full table over every catalog group) + signature. */
export function buildDsResolution(
    dsRules: Parameters<typeof resolveMolecules>[0],
    catalog: MoleculeCatalogEntry[],
): DsResolution {
    const resolvedMolecules = resolveMolecules(dsRules, catalog); // full table (module-agnostic)
    return { resolvedMolecules, catalogVersion: catalogSignature(catalog) };
}

/**
 * Compute and persist the resolution table for designSystems[dsIndex].
 * @param project the project whose project.json holds the DS (e.g. 102043)
 */
export async function recordResolvedMolecules(project: number, dsIndex: number | string): Promise<DsResolution> {
    const dsRules = await readDsRules(project, dsIndex);
    const catalog = await buildMoleculeCatalog();
    const resolution = buildDsResolution(dsRules, catalog);
    await persistResolvedMolecules(project, dsIndex, resolution.resolvedMolecules, resolution.catalogVersion);
    return resolution;
}

// ─── helpers ──────────────────────────────────────────────────────────────

function sortedAxes(axes: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = {};
    for (const k of Object.keys(axes).sort()) out[k] = axes[k];
    return out;
}

/** Small deterministic string hash (FNV-1a, 32-bit) — no mls dependency, testable. */
function hash(s: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
}
