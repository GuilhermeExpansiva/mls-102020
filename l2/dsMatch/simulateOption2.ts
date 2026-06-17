/// <mls fileReference="_102020_/l2/dsMatch/simulateOption2.ts" enhancement="_blank" />

// Simulation for Option 2 (completion tracker + terminal module.ts registration).
// Exercises the deterministic coordination WITHOUT the LLM:
//   - pure tests (tracker + buildGenomeEntry);
//   - drives the tracker with the REAL page list, asserting the LAST page triggers done;
//   - optionally runs registerPageGenome (writes module.ts) when { register: true }.
//
// Run in the app runtime (needs mls.stor):
//   import { simulateOption2 } from '/_102020_/l2/dsMatch/simulateOption2.js';
//   await simulateOption2(102043, 'cafeFlow', 1, 2);                  // dry-run
//   await simulateOption2(102043, 'cafeFlow', 1, 2, { register: true }); // also writes module.ts

import { runDerivationTrackerTests } from '/_102020_/l2/dsMatch/derivationTracker.test.js';
import { runRegisterPageGenomeTests } from '/_102020_/l2/dsMatch/registerPageGenome.test.js';
import { getDerivationTracker, derivationKey, clearDerivationTracker } from '/_102020_/l2/dsMatch/derivationTracker.js';
import { registerPageGenome } from '/_102020_/l2/dsMatch/registerPageGenome.js';
import { listPages, DEFAULT_DEVICE } from '/_102020_/l2/dsMatch/derivePaths.js';

export async function simulateOption2(
    project = 102043,
    module = 'cafeFlow',
    layout: number | string = 1,
    ds: number | string = 2,
    opts: { register?: boolean; device?: string } = {},
): Promise<{ pages: string[]; firedOnLast: boolean; registered: boolean }> {

    const device = opts.device || DEFAULT_DEVICE;

    // Pure tests first.
    for (const [name, fn] of [['derivationTracker', runDerivationTrackerTests], ['registerPageGenome', runRegisterPageGenomeTests]] as const) {
        try { const { passed } = fn(); console.log(`PASS  ${name} pure tests — ${passed} cases`); }
        catch (err: any) { console.log(`FAIL  ${name} pure tests — ${String(err?.message ?? err)}`); }
    }

    const pages = listPages(project, module, device);
    console.log(`\n=== Option 2 simulation — ${module} page${layout}${ds} (${pages.length} pages) ===`);
    console.log(`Pages: ${pages.join(', ') || '(none — page11 not materialized?)'}`);

    // Drive a fresh tracker exactly like agentGenDefs would, page by page.
    const key = derivationKey(project, module, layout, ds, device);
    clearDerivationTracker(key);
    const tracker = getDerivationTracker(key);
    tracker.ensureExpected(pages);

    let firedOnLast = false;
    pages.forEach((p, i) => {
        const done = tracker.complete(p);
        const isLast = i === pages.length - 1;
        console.log(`  completed ${p} → allDone=${done}${isLast ? '  (last)' : ''}`);
        if (isLast) firedOnLast = done;
    });

    const ok = pages.length > 0 && firedOnLast;
    console.log(ok ? 'PASS  tracker fires exactly on the last page' : 'NOTE  tracker did not fire (no pages or mismatch)');

    let registered = false;
    if (opts.register && ok) {
        const entry = await registerPageGenome(project, module, layout, ds, device);
        registered = true;
        console.log(`Registered module.ts genome: ${entry.key} → ${JSON.stringify(entry.value)}`);
    } else if (!opts.register) {
        console.log('(dry-run — pass { register: true } to write module.ts via registerPageGenome)');
    }

    clearDerivationTracker(key);
    return { pages, firedOnLast, registered };
}
