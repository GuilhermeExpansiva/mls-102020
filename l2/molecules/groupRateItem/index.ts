/// <mls fileReference="_102020_/l2/molecules/groupRateItem/index.ts" enhancement="_blank"/>

import { MutationGroup } from '/_102020_/l2/molecules/index.js'

export const mutations: MutationGroup = {
    widgets: [
        {
            name: 'rateStars',
            tag: 'molecules--group-rate-item--rate-stars-102020',
            label: 'Stars',
            description: 'Classic rate with stars',
        },
        {
            name: 'rateHeart',
            tag: 'molecules--group-rate-item--rate-hearts-102020',
            label: 'Hearts',
            description: 'Classic rate with hearts',
        },
        {
            name: 'rateIcons',
            tag: 'molecules--group-rate-item--emoji-satisfaction-102020',
            label: 'Icons',
            description: 'Rate with icons',
        },
    ],

    state: {
        value: 3,
        error: '',
    },

    demo: `
    <molecule-for-replace
        value="{{mutation.demo.value}}"
        error="{{mutation.demo.error}}"
        disabled="false"
        is-editing="true">
        <Label>Choose your mood</Label>
    </molecule-for-replace>
`,
};