/// <mls fileReference="_102020_/l2/molecules/index.ts" enhancement="_blank"/>

import { skills } from '/_102020_/l2/skills/molecules/index.js';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export type SkillCategory =
    | 'dataEntry'
    | 'dataDiscovery'
    | 'dataDisplay'
    | 'actions'
    | 'navigation'
    | 'feedback'
    | 'identity';

export interface MutationGroupEntry {
    name: string;
    category: SkillCategory;
    icon: string;               // SVG path(s) for viewBox="0 0 24 24"
    label: string;
    shortDescription: string;
    mutationIndex: string;
}

export interface MutationWidget {
    name: string;
    tag: string;
    label: string;
    description: string;
}

export interface MutationGroup {
    widgets: MutationWidget[];
    demo: string;
    state: Record<string, any>;
}
// ═══════════════════════════════════════════════════════════════
// Mutation Groups
// ═══════════════════════════════════════════════════════════════

export const mutationGroups: MutationGroupEntry[] = [

    // ── Data Entry ─────────────────────────────────────────────

    {
        name: 'groupSelectOne',
        category: 'dataEntry',
        icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
        label: 'Select one',
        shortDescription: 'Choose exactly one option from a list',
        mutationIndex: '/_102020_/l2/molecules/groupSelectOne/index',
    },
    {
        name: 'groupSelectMany',
        category: 'dataEntry',
        icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
        label: 'Select many',
        shortDescription: 'Choose one or more options from a list',
        mutationIndex: '/_102020_/l2/molecules/groupSelectMany/mutations',
    },
    {
        name: 'groupEnterText',
        category: 'dataEntry',
        icon: '<path d="M4 7h16M4 12h10M4 17h13"/>',
        label: 'Enter text',
        shortDescription: 'Free-form text input',
        mutationIndex: '/_102020_/l2/molecules/groupEnterText/mutations',
    },
    {
        name: 'groupEnterNumber',
        category: 'dataEntry',
        icon: '<path d="M5 17l5-10 4 6 3-3 3 7"/>',
        label: 'Enter number',
        shortDescription: 'Numeric value input',
        mutationIndex: '/_102020_/l2/molecules/groupEnterNumber/mutations',
    },
    {
        name: 'groupEnterMoney',
        category: 'dataEntry',
        icon: '<circle cx="12" cy="12" r="8"/><path d="M9 12h6M9 9h6M9 15h3M12 6v-2M12 20v-2"/>',
        label: 'Enter money',
        shortDescription: 'Currency value with locale formatting',
        mutationIndex: '/_102020_/l2/molecules/groupEnterMoney/mutations',
    },
    {
        name: 'groupEnterDatetime',
        category: 'dataEntry',
        icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/><circle cx="12" cy="15" r="1.5"/>',
        label: 'Enter datetime',
        shortDescription: 'Date and time input combined',
        mutationIndex: '/_102020_/l2/molecules/groupEnterDateTime/mutations',
    },
    {
        name: 'groupEnterDate',
        category: 'dataEntry',
        icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
        label: 'Enter date',
        shortDescription: 'Date-only input, no time',
        mutationIndex: '/_102020_/l2/molecules/groupEnterDate/mutations',
    },
    {
        name: 'groupEnterTime',
        category: 'dataEntry',
        icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
        label: 'Enter time',
        shortDescription: 'Time-only input, no date',
        mutationIndex: '/_102020_/l2/molecules/groupEnterTime/mutations',
    },
    {
        name: 'groupEnterDateInterval',
        category: 'dataEntry',
        icon: '<rect x="2" y="6" width="8" height="12" rx="1.5"/><rect x="14" y="6" width="8" height="12" rx="1.5"/><path d="M10 12h4" stroke-dasharray="2 2"/>',
        label: 'Date interval',
        shortDescription: 'Date range with start and end',
        mutationIndex: '/_102020_/l2/molecules/groupEnterDateInterval/mutations',
    },
    {
        name: 'groupEnterDateTimeInterval',
        category: 'dataEntry',
        icon: '<rect x="2" y="6" width="8" height="12" rx="1.5"/><rect x="14" y="6" width="8" height="12" rx="1.5"/><path d="M10 12h4" stroke-dasharray="2 2"/><circle cx="6" cy="15" r="1"/><circle cx="18" cy="15" r="1"/>',
        label: 'Datetime interval',
        shortDescription: 'Date+time range with start and end',
        mutationIndex: '/_102020_/l2/molecules/groupEnterDateTimeInterval/mutations',
    },
    {
        name: 'groupEnterTimeInterval',
        category: 'dataEntry',
        icon: '<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/><path d="M8 7v-1M8 18v-1M16 7v-1M16 18v-1"/>',
        label: 'Time interval',
        shortDescription: 'Time range, supports overnight',
        mutationIndex: '/_102020_/l2/molecules/groupEnterTimeInterval/mutations',
    },
    {
        name: 'groupLocatePosition',
        category: 'dataEntry',
        icon: '<path d="M12 2C8 2 5 5.5 5 10c0 7 7 12 7 12s7-5 7-12c0-4.5-3-8-7-8z"/><circle cx="12" cy="10" r="2.5"/>',
        label: 'Locate position',
        shortDescription: 'Geographic location input',
        mutationIndex: '/_102020_/l2/molecules/groupLocatePosition/mutations',
    },
    {
        name: 'groupSelectFileForUpload',
        category: 'dataEntry',
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3-3 3 3"/>',
        label: 'Upload file',
        shortDescription: 'File selection with drag-drop',
        mutationIndex: '/_102020_/l2/molecules/groupSelectFileForUpload/mutations',
    },
    {
        name: 'groupRateItem',
        category: 'dataEntry',
        icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>',
        label: 'Rate item',
        shortDescription: 'Star rating, NPS, emoji score',
        mutationIndex: '/_102020_/l2/molecules/groupRateItem/index',
    },

    // ── Data Display ───────────────────────────────────────────

    {
        name: 'groupViewChart',
        category: 'dataDisplay',
        icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17V11M12 17V7M17 17v-4"/>',
        label: 'View chart',
        shortDescription: 'Bar, line, pie, area charts',
        mutationIndex: '/_102020_/l2/molecules/groupViewChart/mutations',
    },
    {
        name: 'groupViewData',
        category: 'dataDisplay',
        icon: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="9" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/>',
        label: 'View data',
        shortDescription: 'Adaptive data collection display',
        mutationIndex: '/_102020_/l2/molecules/groupViewData/mutations',
    },
    {
        name: 'groupViewTable',
        category: 'dataDisplay',
        icon: '<path d="M3 6h18M3 12h18M3 18h18"/><path d="M9 6v12M15 6v12" stroke-dasharray="2 2" opacity=".5"/>',
        label: 'View table',
        shortDescription: 'Sortable, filterable data table',
        mutationIndex: '/_102020_/l2/molecules/groupViewTable/mutations',
    },

    // ── Feedback ────────────────────────────────────────────────

    {
        name: 'groupShowProgress',
        category: 'feedback',
        icon: '<path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20" stroke-dasharray="3 3"/>',
        label: 'Show progress',
        shortDescription: 'Progress bar, ring, spinner',
        mutationIndex: '/_102020_/l2/molecules/groupShowProgress/index',
    },
    {
        name: 'groupNotifyUser',
        category: 'feedback',
        icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
        label: 'Notify user',
        shortDescription: 'Toast, alert, snackbar feedback',
        mutationIndex: '/_102020_/l2/molecules/groupNotifyUser/mutations',
    },
];

// ═══════════════════════════════════════════════════════════════
// Helper: enriquece com dados do index original
// ═══════════════════════════════════════════════════════════════

export function getEnrichedGroups() {
    return mutationGroups.map(group => {
        const skill = skills.find(s => s.name === group.name);
        return {
            ...group,
            description: skill?.description ?? '',
            skillReference: skill?.skillReference ?? '',
        };
    });
}

// ═══════════════════════════════════════════════════════════════
// Helper: renderiza o icon SVG
// ═══════════════════════════════════════════════════════════════

export function renderIcon(icon: string, size = 24): string {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}"
        fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        ${icon}
    </svg>`;
}