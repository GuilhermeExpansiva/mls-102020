/// <mls fileReference="_102020_/l2/skills/molecules/groupEnterText/usage.ts" enhancement="_blank"/>

export const skill = `

# enter + text — Usage

> Quick reference for using molecules in the **enter + text** group.
> Use this when you need the user to provide **free-form text**.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Label displayed above or beside the field |
| \`Helper\` | Descriptive text shown below the field when there is no error |
| \`Prefix\` | Content rendered before the input (e.g. icon, static text) |
| \`Suffix\` | Content rendered after the input (e.g. icon, action button) |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`string\` | \`''\` | Current text value |
| \`error\` | \`string\` | \`''\` | Error message. Empty string means no error |
| \`name\` | \`string\` | \`''\` | Field name for form identification |
| \`placeholder\` | \`string\` | \`''\` | Placeholder text when value is empty |
| \`maxLength\` | \`number \| null\` | \`null\` | Maximum number of characters (null = no limit) |
| \`minLength\` | \`number \| null\` | \`null\` | Minimum number of characters (null = no minimum) |
| \`rows\` | \`number\` | \`1\` | Number of visible rows. \`1\` = input, \`>1\` = textarea |
| \`autocomplete\` | \`string\` | \`''\` | HTML autocomplete value (e.g. \`'email'\`, \`'name'\`, \`'off'\`) |
| \`inputType\` | \`string\` | \`'text'\` | Input type: \`'text'\`, \`'email'\`, \`'password'\`, \`'search'\`, \`'url'\`, \`'tel'\` |
| \`mask\` | \`string\` | \`''\` | Mask pattern. \`#\` = digit, \`A\` = letter, \`*\` = any. Literals inserted automatically |
| \`isEditing\` | \`boolean\` | \`true\` | \`true\` = input mode, \`false\` = read-only text |
| \`disabled\` | \`boolean\` | \`false\` | Disables the field entirely |
| \`readonly\` | \`boolean\` | \`false\` | Prevents editing but keeps the field focusable |
| \`required\` | \`boolean\` | \`false\` | Marks the value as required |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading indicator inside the field |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`change\` | \`{ value: string }\` | Fired when value is confirmed on blur |
| \`input\` | \`{ value: string }\` | Fired on each keystroke |
| \`blur\` | \`{}\` | Fired when the field loses focus |
| \`focus\` | \`{}\` | Fired when the field receives focus |

---

## Value Format

- Value is always a plain **string**
- Empty string \`''\` when not yet provided
- When \`mask\` is set, \`value\` contains the **raw unmasked string** — the formatted display is handled internally
- When \`inputType='password'\`, view mode renders \`"••••••••"\` regardless of value

---

## Examples

### Simple text field

\`\`\`html
<molecules--text-input-102020
  value="{{ui.form.firstName}}"
  error="{{ui.form.firstNameError}}"
  placeholder="John"
  maxLength="200"
  required>
  <Label>First Name</Label>
</molecules--text-input-102020>
\`\`\`

`;
