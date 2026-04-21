/// <mls fileReference="_102020_/l2/molecules/groupShowProgress/index.ts" enhancement="_blank"/>

import { MutationGroup } from '/_102020_/l2/molecules/index.js'

export const mutations: MutationGroup = {
    widgets: [
        {
            name: 'progressBar',
            tag: 'molecules--group-show-progress--progress-bar-102020',
            label: 'Bar',
            description: 'Classic progress bar',
        },
        {
            name: 'progressRing',
            tag: 'molecules--group-show-progress--progress-ring-102020',
            label: 'Ring',
            description: 'Classic progress ring',
        },
        {
            name: 'progressSpinner',
            tag: 'molecules--group-show-progress--spinner-102020',
            label: 'Spinner',
            description: 'Classic load spinner',
        },
    ],

    state: {
        value: 30,
        size: '',
    },

    demo: `
    <molecule-for-replace
        size="md"
        class="w-full"
        show-value="true"
    >
    </molecule-for-replace>
`,
};