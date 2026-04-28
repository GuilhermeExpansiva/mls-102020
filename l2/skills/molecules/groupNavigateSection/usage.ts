/// <mls fileReference="_102020_/l2/skills/molecules/groupNavigateSection/usage.ts" enhancement="_blank"/>

export const skill = `
# groupNavigateSection — Usage

> Quick reference for using molecules in the **groupNavigateSection** group.
> Use this when the user needs to **switch between sections** within the same context.
> The component renders both the tab indicators and the active section's content.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Title displayed above the navigation |
| \`Tab\` | One section. Attributes: \`value\` (required, unique identifier), \`title\` (required), \`icon\` (optional), \`disabled\` (presence). Content = the section body (text, HTML, web components) |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`string \| null\` | \`null\` | Value of the active tab. \`null\` = first non-disabled tab |
| \`error\` | \`string\` | \`''\` | Error message. Empty string means no error |
| \`disabled\` | \`boolean\` | \`false\` | Disables all navigation |
| \`loading\` | \`boolean\` | \`false\` | Shows loading state |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`change\` | \`{ value: string, title: string }\` | Fired when the active tab changes |

---

## Value Format

- \`value\` is a **string** matching a \`<Tab>\` value attribute
- \`null\` defaults to first non-disabled tab
- The component renders only the content of the active tab

---

## Examples

### Product detail tabs

\`\`\`html
<molecules--tabs-102020
  value="{{ui.product.activeTab}}">
  <Tab value="overview" title="Overview">
    <p>Full product description and images here...</p>
  </Tab>
  <Tab value="specs" title="Specifications">
    <molecules--data-table-102020>
      ...specs table...
    </molecules--data-table-102020>
  </Tab>
  <Tab value="reviews" title="Reviews">
    <p>Customer reviews list here...</p>
  </Tab>
  <Tab value="support" title="Support" disabled></Tab>
</molecules--tabs-102020>
\`\`\`

`