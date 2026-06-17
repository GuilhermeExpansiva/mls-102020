/// <mls fileReference="_102020_/l2/dsMatch/derivationTracker.test.ts" enhancement="_blank" />

// Tests for the DerivationTracker class (pure, no mls runtime). Exposes
// `runDerivationTrackerTests()` — throws on failure, returns the case count.

import { DerivationTracker, derivationKey } from '/_102020_/l2/dsMatch/derivationTracker.js';

function assert(cond: boolean, msg: string): void {
    if (!cond) throw new Error(`[derivationTracker.test] FAIL: ${msg}`);
}

export function runDerivationTrackerTests(): { passed: number } {
    let passed = 0;

    // 1. Not done until every expected page completes.
    {
        const t = new DerivationTracker();
        t.ensureExpected(['a', 'b', 'c']);
        assert(t.complete('a') === false, 'should not be done after 1/3');
        assert(t.complete('b') === false, 'should not be done after 2/3');
        assert(t.complete('c') === true, 'should be done after 3/3');
        passed++;
    }

    // 2. Empty expected set → never "all completed".
    {
        const t = new DerivationTracker();
        assert(t.isAllCompleted() === false, 'empty tracker must not report done');
        assert(t.complete('x') === false, 'completing without expected must not report done');
        passed++;
    }

    // 3. ensureExpected is idempotent and can be re-asserted (session-reset robustness).
    {
        const t = new DerivationTracker();
        t.ensureExpected(['a', 'b']);
        t.complete('a');
        t.ensureExpected(['a', 'b']); // re-assert, no effect on completed
        assert(t.isAllCompleted() === false, 'still missing b');
        assert(t.complete('b') === true, 'done after b');
        passed++;
    }

    // 4. Extra completions / unknown pages do not break completion.
    {
        const t = new DerivationTracker();
        t.ensureExpected(['a']);
        assert(t.complete('zzz') === false, 'unknown page should not satisfy expected');
        assert(t.complete('a') === true, 'expected page completes it');
        passed++;
    }

    // 5. derivationKey is stable and distinct per variation.
    {
        const k1 = derivationKey(102043, 'cafeFlow', 1, 2, 'desktop');
        const k2 = derivationKey(102043, 'cafeFlow', 1, 2, 'desktop');
        const k3 = derivationKey(102043, 'cafeFlow', 1, 3, 'desktop');
        assert(k1 === k2, 'same args → same key');
        assert(k1 !== k3, 'different ds → different key');
        passed++;
    }

    console.log(`[derivationTracker.test] OK — ${passed} cases`);
    return { passed };
}
