/// <mls fileReference="_102020_/l2/skills/molecules/groupShowProgress/usage.ts" enhancement="_blank"/>

export const skill = `
# show + progress — Usage

> Quick reference for using molecules in the **show + progress** group.
> Use this when the system needs to **indicate the progress of an operation**.
> This is a visual primitive — designed to be composed inside other components.

---


## Slot Tags

None. This component has no slot tags.

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`number \| null\` | \`null\` | Progress 0–100. \`null\` = indeterminate (unknown duration) |
| \`size\` | \`string\` | \`'md'\` | Visual size: \`'xs'\`, \`'sm'\`, \`'md'\`, \`'lg'\` |
| \`label\` | \`string\` | \`''\` | Accessible label describing what is loading |
| \`show-value\` | \`boolean\` | \`false\` | Display the percentage number alongside the indicator |

---

## Events

None. This component is purely visual.

---

## Value Format

- \`number\` (0–100): determinate progress, renders a fill at that percentage
- \`null\`: indeterminate, renders an animated loop (spinner, pulse, sliding bar)

---

## Examples

### Spinner inside a button (indeterminate)

\`\`\`html
<molecules--spinner-102020
  size="sm"
  label="Saving...">
</molecules--spinner-102020>
\`\`\`


### Determinate ring with percentage

\`\`\`html
<molecules--progress-ring-102020
  value="{{ui.report.progress}}"
  size="md"
  show-value="true"
  label="Generating report">
</molecules--progress-ring-102020>
\`\`\`
`;
