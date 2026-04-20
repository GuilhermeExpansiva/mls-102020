/// <mls fileReference="_102020_/l2/skills/molecules/groupEnterDateInterval/usage.ts" enhancement="_blank"/>

export const skill = `
# enter + date-interval — Usage

> Quick reference for using molecules in the **enter + date-interval** group.
> Use this when you need the user to provide a **date range (start and end date, no time)**.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Overall label for the range field |
| \`LabelStart\` | Label shown above the start date input |
| \`LabelEnd\` | Label shown above the end date input |
| \`Helper\` | Descriptive text shown below the field when there is no error |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`startDate\` | \`string \| null\` | \`null\` | Start date in ISO 8601 format (\`"YYYY-MM-DD"\`) |
| \`endDate\` | \`string \| null\` | \`null\` | End date in ISO 8601 format (\`"YYYY-MM-DD"\`) |
| \`error\` | \`string\` | \`''\` | Error message. Empty string means no error |
| \`name\` | \`string\` | \`''\` | Field name for form identification |
| \`locale\` | \`string\` | \`''\` | Display locale, e.g. \`'en-US'\`, \`'pt-BR'\` |
| \`minDate\` | \`string\` | \`''\` | Minimum selectable date (\`"YYYY-MM-DD"\`) |
| \`maxDate\` | \`string\` | \`''\` | Maximum selectable date (\`"YYYY-MM-DD"\`) |
| \`minRangeDays\` | \`number\` | \`0\` | Minimum number of days the range must span (0 = no minimum) |
| \`maxRangeDays\` | \`number\` | \`0\` | Maximum number of days the range can span (0 = no maximum) |
| \`firstDayOfWeek\` | \`number\` | \`0\` | First day of week: \`0\` = Sunday, \`1\` = Monday |
| \`allowSameDay\` | \`boolean\` | \`true\` | Allow start and end on the same day |
| \`isEditing\` | \`boolean\` | \`true\` | \`true\` = input mode, \`false\` = read-only formatted text |
| \`disabled\` | \`boolean\` | \`false\` | Disables the field entirely |
| \`readonly\` | \`boolean\` | \`false\` | Prevents editing but keeps the field focusable |
| \`required\` | \`boolean\` | \`false\` | Marks both dates as required |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading indicator inside the field |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`change\` | \`{ startDate: string \| null, endDate: string \| null }\` | Fired when both dates are confirmed |
| \`startChange\` | \`{ value: string \| null }\` | Fired when start date changes |
| \`endChange\` | \`{ value: string \| null }\` | Fired when end date changes |
| \`blur\` | \`{}\` | Fired when the field loses focus |
| \`focus\` | \`{}\` | Fired when the field receives focus |

---

## Value Format

- Both \`startDate\` and \`endDate\` are ISO 8601 date strings: \`"YYYY-MM-DD"\`
- \`null\` means not yet selected
- No time component is ever stored or emitted
- \`endDate\` is always ≥ \`startDate\`

---

## Examples

### Basic

\`\`\`html
<molecules--date-interval-102020
  startDate="{{ui.form.vacationStart}}"
  endDate="{{ui.form.vacationEnd}}"
  error="{{ui.form.vacationError}}"
  locale="pt-BR"
  required>
  <Label>Vacation Period</Label>
  <LabelStart>From</LabelStart>
  <LabelEnd>To</LabelEnd>
</molecules--date-interval-102020>
\`\`\`

### With range constraints and helper

\`\`\`html
<molecules--date-interval-102020
  startDate="{{ui.report.startDate}}"
  endDate="{{ui.report.endDate}}"
  error="{{ui.report.dateError}}"
  locale="en-US"
  minDate="2026-01-01"
  maxDate="2026-12-31"
  maxRangeDays="90">
  <Label>Report Period</Label>
  <Helper>Maximum range is 90 days</Helper>
</molecules--date-interval-102020>
\`\`\`

`