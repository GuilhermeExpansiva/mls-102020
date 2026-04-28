/// <mls fileReference="_102020_/l2/skills/molecules/groupTriggerAction/usage.ts" enhancement="_blank"/>

export const skill = `
# trigger + action — Usage

> Quick reference for using molecules in the **trigger + action** group.
> Use this when the user needs to **execute an action or command**.
> All implementations share the same slot tag contract.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Button text content |
| \`Icon\` | Icon content (SVG, emoji, HTML) displayed alongside or instead of the label |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`size\` | \`string\` | \`'md'\` | Button size: \`'xs'\`, \`'sm'\`, \`'md'\`, \`'lg'\` |
| \`type\` | \`string\` | \`'button'\` | HTML button type: \`'button'\`, \`'submit'\`, \`'reset'\` |
| \`icon-position\` | \`string\` | \`'start'\` | Icon placement: \`'start'\` or \`'end'\` |
| \`disabled\` | \`boolean\` | \`false\` | Disables the button |
| \`loading\` | \`boolean\` | \`false\` | Shows loading indicator, blocks interaction |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`action\` | \`{}\` | Fired when the button is clicked |

---

## Examples

### Primary button

\`\`\`html
<molecules--button-102020
  size="md">
  <Label>Save Changes</Label>
</molecules--button-102020>
\`\`\`

`;