/// <mls fileReference="_102020_/l2/dsMatch/registerPageGenome.test.ts" enhancement="_blank" />

// Tests for the pure part of registerPageGenome (buildGenomeEntry). No mls runtime.
// Exposes `runRegisterPageGenomeTests()` — throws on failure, returns the case count.

import { buildGenomeEntry } from '/_102020_/l2/dsMatch/registerPageGenome.js';

function assert(cond: boolean, msg: string): void {
    if (!cond) throw new Error(`[registerPageGenome.test] FAIL: ${msg}`);
}

export function runRegisterPageGenomeTests(): { passed: number } {
    let passed = 0;

    // 1. Folder key uses indices; value uses names.
    {
        const e = buildGenomeEntry(1, 2, 'ERP Compact', 'standard');
        assert(e.key === 'web/desktop/page12', `key wrong: ${e.key}`);
        assert(e.value.designSystem === 'ERP Compact', 'designSystem name wrong');
        assert(e.value.layout === 'standard', 'layout name wrong');
        assert(e.value.device === 'desktop', 'device wrong');
        passed++;
    }

    // 2. Device override flows into key and value.
    {
        const e = buildGenomeEntry(1, 3, 'Neumorphism', 'standard', 'mobile');
        assert(e.key === 'web/mobile/page13', `key wrong: ${e.key}`);
        assert(e.value.device === 'mobile', 'device override wrong');
        passed++;
    }

    console.log(`[registerPageGenome.test] OK — ${passed} cases`);
    return { passed };
}
