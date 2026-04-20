/// <mls fileReference="_102020_/l2/skills/molecules/groupSelectOne/usage.ts" enhancement="_blank"/>

export const skill = `
# select + one — Usage

> Quick reference for using molecules in the **select + one** group.
> Use this when you need the user to **choose exactly one option** from a list.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Label displayed above or beside the field |
| \`Helper\` | Descriptive text shown below the field when there is no error |
| \`Trigger\` | Custom content for the trigger button. When no item is selected, this content acts as the placeholder |
| \`Item\` | One selectable option. Attributes: \`value\` (required), \`disabled\` |
| \`Group\` | Groups items under a named heading. Attribute: \`label\` |
| \`Empty\` | Content shown when no items are available |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`string \| null\` | \`null\` | Value of the selected item. \`null\` = nothing selected |
| \`error\` | \`string\` | \`''\` | Error message. Empty string means no error |
| \`name\` | \`string\` | \`''\` | Field name for form identification |
| \`placeholder\` | \`string\` | \`''\` | Text shown when no item is selected |
| \`searchable\` | \`boolean\` | \`false\` | Show a search input to filter items |
| \`isEditing\` | \`boolean\` | \`true\` | \`true\` = interactive selector, \`false\` = read-only label |
| \`disabled\` | \`boolean\` | \`false\` | Disables the field entirely |
| \`readonly\` | \`boolean\` | \`false\` | Prevents selection but keeps the field focusable |
| \`required\` | \`boolean\` | \`false\` | Marks a selection as required |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading indicator; panel does not open |


---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`change\` | \`{ value: string \| null }\` | Fired when an item is selected |
| \`blur\` | \`{}\` | Fired when the field loses focus |
| \`focus\` | \`{}\` | Fired when the field receives focus |

---

## Value Format

- Value is a plain **string** matching the \`value\` attribute of the selected \`<Item>\`
- \`null\` when nothing is selected
- The displayed label comes from the \`<Item>\` inner content — not stored in \`value\`

---

## Examples

### Simple dropdown

\`\`\`html
<molecules--dropdown-102020
  value="{{ui.form.country}}"
  error="{{ui.form.countryError}}"
  required>
  <Label>Country</Label>
  <Trigger>Select a country...</Trigger>
  <Item value="br">Brazil</Item>
  <Item value="us">United States</Item>
  <Item value="de">Germany</Item>
</molecules--dropdown-102020>
\`\`\`

### Grouped options

\`\`\`html
<molecules--dropdown-102020
  value="{{ui.form.category}}"
  error="{{ui.form.categoryError}}">
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
</molecules--dropdown-102020>
\`\`\`

`