/// <mls fileReference="_102020_/l2/dsMatch/derivationTracker.ts" enhancement="_blank" />

// Completion tracker for a DS derivation (Option 2 — "know when all pages finished").
//
// Same idea as MaterializeOrchestrator: an in-memory singleton (keyed per
// derivation) that records which pages completed and tells when ALL are done. It is
// NOT a step, so it survives the parallel batches (which kill steps) as long as the
// JS session stays loaded. To be robust against a session reset mid-run, callers
// re-assert the expected set (ensureExpected) on every completion.

export class DerivationTracker {
    private expected = new Set<string>();
    private completed = new Set<string>();

    /** Register (idempotently) the pages that must complete. */
    ensureExpected(pages: string[]): void {
        for (const p of pages) this.expected.add(p);
    }

    /** Mark a page completed; returns true when ALL expected pages are now done. */
    complete(page: string): boolean {
        this.completed.add(page);
        return this.isAllCompleted();
    }

    isAllCompleted(): boolean {
        return this.expected.size > 0 && [...this.expected].every(p => this.completed.has(p));
    }

    status(): { expected: string[]; completed: string[]; done: boolean } {
        return { expected: [...this.expected], completed: [...this.completed], done: this.isAllCompleted() };
    }

    reset(): void {
        this.expected.clear();
        this.completed.clear();
    }
}

// ─── singleton registry (runtime) ────────────────────────────────────────────

const trackers = new Map<string, DerivationTracker>();

/** Stable key for a derivation: project + module + device + target variation. */
export function derivationKey(
    project: number,
    module: string,
    layout: number | string,
    ds: number | string,
    device: string,
): string {
    return `${project}:${module}:${device}:page${layout}${ds}`;
}

export function getDerivationTracker(key: string): DerivationTracker {
    let t = trackers.get(key);
    if (!t) { t = new DerivationTracker(); trackers.set(key, t); }
    return t;
}

export function clearDerivationTracker(key: string): void {
    trackers.delete(key);
}
