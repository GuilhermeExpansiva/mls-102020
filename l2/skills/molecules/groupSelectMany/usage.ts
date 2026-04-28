/// <mls fileReference="_102020_/l2/skills/molecules/groupSelectMany/usage.ts" enhancement="_blank"/>

export const skill = `
# select + many — Usage

> Quick reference for using molecules in the **select + many** group.
> Use this when you need the user to **choose one or more options** from a list.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Label displayed above or beside the field |
| \`Helper\` | Descriptive text shown below the field when there is no error |
| \`Trigger\` | Custom content for the trigger button (dropdown implementations) |
| \`Item\` | One selectable option. Attributes: \`value\` (required), \`disabled\` |
| \`Group\` | Groups items under a named heading. Attribute: \`label\` |
| \`Empty\` | Content shown when no items are available |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`string\` | \`''\` | Comma-separated selected values (e.g. \`"apple,banana,grape"\`) |
| \`error\` | \`string\` | \`''\` | Error message. Empty string means no error |
| \`name\` | \`string\` | \`''\` | Field name for form identification |
| \`placeholder\` | \`string\` | \`''\` | Text shown when no items are selected |
| \`searchable\` | \`boolean\` | \`false\` | Show a search input to filter items |
| \`min-selection\` | \`number\` | \`0\` | Minimum selected items (0 = no minimum) |
| \`max-selection\` | \`number\` | \`0\` | Maximum selected items (0 = no limit) |
| \`is-editing\` | \`boolean\` | \`true\` | \`true\` = interactive selector, \`false\` = read-only labels |
| \`disabled\` | \`boolean\` | \`false\` | Disables the field entirely |
| \`readonly\` | \`boolean\` | \`false\` | Prevents selection but keeps the field focusable |
| \`required\` | \`boolean\` | \`false\` | At least one selection is required |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading indicator; panel does not open |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`change\` | \`{ value: string }\` | Fired when selection changes. Value is comma-separated string |
| \`blur\` | \`{}\` | Fired when the field loses focus |
| \`focus\` | \`{}\` | Fired when the field receives focus |

---

## Value Format

- Comma-separated **string** of selected item values
- Empty string \`''\` when nothing is selected
- Example: \`"read,write,execute"\`
- Item values must not contain commas

---

## Examples

### Checkbox group — permissions

\`\`\`html
<molecules--checkbox-group-102020
  value="{{ui.user.permissions}}"
  error="{{ui.user.permissionsError}}"
  required>
  <Label>Permissions</Label>
  <Item value="read">Read</Item>
  <Item value="write">Write</Item>
  <Item value="execute">Execute</Item>
  <Item value="admin" disabled>Admin (restricted)</Item>
</molecules--checkbox-group-102020>
\`\`\`

`;