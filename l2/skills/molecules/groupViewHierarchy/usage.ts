/// <mls fileReference="_102020_/l2/skills/molecules/groupViewHierarchy/usage.ts" enhancement="_blank"/>

export const skill = `
# view + hierarchy — Usage

> Quick reference for using molecules in the **view + hierarchy** group.
> Use this when the user needs to **visualize hierarchical data structures**.
> All implementations share the same slot tag contract.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Title displayed above the hierarchy |
| \`Node\` | A hierarchy node. Free content (text, icons, HTML). Nest \`<Node>\` inside \`<Node>\` for children. Attributes: \`expanded\` (presence), \`disabled\` (presence) |
| \`Empty\` | Content shown when no nodes exist |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`multiple\` | \`boolean\` | \`true\` | Allow multiple nodes open at once. \`false\` = one per level |
| \`expand-all\` | \`boolean\` | \`false\` | Start with all nodes expanded |
| \`disabled\` | \`boolean\` | \`false\` | Disables all interaction |
| \`loading\` | \`boolean\` | \`false\` | Shows loading placeholder |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`toggle\` | \`{ expanded: boolean }\` | Fired when a node is expanded or collapsed |
| \`nodeClick\` | \`{ value: string \| null }\` | Fired when a node is clicked |
---

## Examples

### Folder structure (tree view)

\`\`\`html
<molecules--tree-view-102020>
  <Label>Project Files</Label>
  <Node>
    📁 src
    <Node>
      📁 components
      <Node>📄 Header.tsx</Node>
      <Node>📄 Footer.tsx</Node>
    </Node>
    <Node>
      📁 pages
      <Node>📄 Home.tsx</Node>
      <Node>📄 About.tsx</Node>
    </Node>
  </Node>
  <Node>
    📁 public
    <Node>📄 index.html</Node>
  </Node>
  <Node>📄 package.json</Node>
</molecules--tree-view-102020>
\`\`\`

`;
