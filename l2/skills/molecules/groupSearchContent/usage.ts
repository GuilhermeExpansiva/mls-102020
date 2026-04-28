/// <mls fileReference="_102020_/l2/skills/molecules/groupSearchContent/usage.ts" enhancement="_blank"/>

export const skill = `
# search + content — Usage

> Quick reference for using molecules in the **search + content** group.
> Use this when the user needs to **find content using text search**.
> The component emits \`search\` events; the page provides suggestions via slot tags.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Label displayed above the search field |
| \`Helper\` | Descriptive text shown below the field when there is no error |
| \`Suggestion\` | One search result. Attributes: \`value\` (required). Content = display label |
| \`Empty\` | Content shown when no suggestions match |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`string \| null\` | \`null\` | Confirmed value — suggestion value or typed text. \`null\` = nothing confirmed |
| \`error\` | \`string\` | \`''\` | Error message. Empty string means no error |
| \`name\` | \`string\` | \`''\` | Field name for form identification |
| \`placeholder\` | \`string\` | \`''\` | Placeholder text for the search input |
| \`debounce\` | \`number\` | \`300\` | Debounce time in ms before emitting \`search\` event |
| \`disabled\` | \`boolean\` | \`false\` | Disables the field |
| \`loading\` | \`boolean\` | \`false\` | Shows loading indicator while fetching suggestions |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`search\` | \`{ query: string }\` | Fired (debounced) when user types. Page should update suggestions |
| \`change\` | \`{ value: string \| null }\` | Fired when value is confirmed (suggestion selected or Enter pressed) |
| \`clear\` | \`{}\` | Fired when the user clears the search |
| \`blur\` | \`{}\` | Fired when the field loses focus |
| \`focus\` | \`{}\` | Fired when the field receives focus |

---

## Value Format

- \`value\` is a **string** — either the selected suggestion's \`value\` attribute or the raw typed text
- \`null\` when nothing is confirmed
- User selects suggestion → \`value\` = suggestion value
- User presses Enter → \`value\` = typed text

---

## Examples

### Product search with suggestions

\`\`\`html
<molecules--search-field-102020
  value="{{ui.catalog.selectedProduct}}"
  error="{{ui.catalog.searchError}}"
  loading="{{ui.catalog.isSearching}}"
  placeholder="Search products..."
  debounce="300">
  <Label>Product Search</Label>
  <Suggestion value="prod-001">Wireless Headphones</Suggestion>
  <Suggestion value="prod-002">Bluetooth Speaker</Suggestion>
  <Suggestion value="prod-003">USB-C Cable</Suggestion>
  <Empty>No products found</Empty>
</molecules--search-field-102020>
\`\`\`

`;