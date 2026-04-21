/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/index.ts" enhancement="_blank"/>

import { MutationGroup } from '/_102020_/l2/molecules/index.js'

export const mutations: MutationGroup = {
    widgets: [
        {
            name: 'dropdown',
            tag: 'molecules--group-select-one--select-dropdown-102020',
            label: 'Dropdown',
            description: 'Classic dropdown with search and groups',
        },
        {
            name: 'radioGroup',
            tag: 'molecules--group-select-one--radio-group-select-102020',
            label: 'Radio group',
            description: 'Vertical or horizontal radio buttons',
        },
        {
            name: 'segmentedControl',
            tag: 'molecules--group-select-one--segmented-control-102020',
            label: 'Segmented',
            description: 'Segmented button bar for few options',
        },
    ],

    state: {
        value: 'mango',
        error: '',
    },

    demo: `
    <molecule-for-replace
        value="{{mutation.demo.value}}"
        error="{{mutation.demo.error}}"
        disabled="false"
        isEditing="true">
        <Label>Category</Label>
        <Trigger>Select a category...</Trigger>
        <Group label="Electronics">
            <Item value="phones">Phones</Item>
            <Item value="laptops">Laptops</Item>
        </Group>
        <Group label="Clothing">
            <Item value="shirts">Shirts</Item>
            <Item value="shoes">Shoes</Item>
        </Group>
        <Empty>No categories available</Empty>
    </molecule-for-replace>
`,
};