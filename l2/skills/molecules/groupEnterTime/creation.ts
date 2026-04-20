/// <mls fileReference="_102020_/l2/skills/molecules/groupEnterTime/creation.ts" enhancement="_blank"/>

export const skill = `
# enter + time — Creation

> Implementation reference for creating molecules in the **enter + time** group.
> Follow the general Lit/Aura rules defined in \`molecule-generation2.md\`.

---

## 1. Metadata

| Field | Value |
|-------|-------|
| **Group** | \`enter + time\` |
| **Category** | Data Entry |
| **Version** | \`1.0.0\` |

---

## 2. Slot Tags

| Tag | Required | Description |
|-----|:--------:|-------------|
| \`Label\` | No | Field label |
| \`Helper\` | No | Help text displayed below the field |

\`\`\`typescript
slotTags = ['Label', 'Helper'];
\`\`\`

---

## 3. Properties

### 3.1 Data

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`value\` | \`string \| null\` | \`null\` | \`@propertyDataSource\` | Time string in 24h format: \`"HH:mm"\` or \`"HH:mm:ss"\` |
| \`error\` | \`string\` | \`''\` | \`@propertyDataSource\` | Error message (empty = no error) |
| \`name\` | \`string\` | \`''\` | \`@propertyDataSource\` | Field name (for forms) |

### 3.2 Configuration

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`locale\` | \`string\` | \`''\` | \`@propertyDataSource\` | Locale for display formatting |
| \`hour12\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Display in 12-hour format (AM/PM) |
| \`showSeconds\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Include seconds in input and stored value |
| \`minuteStep\` | \`number\` | \`1\` | \`@propertyDataSource\` | Minutes increment in picker |
| \`minTime\` | \`string\` | \`''\` | \`@propertyDataSource\` | Minimum allowed time (\`"HH:mm"\`) |
| \`maxTime\` | \`string\` | \`''\` | \`@propertyDataSource\` | Maximum allowed time (\`"HH:mm"\`) |
| \`placeholder\` | \`string\` | \`''\` | \`@propertyDataSource\` | Placeholder text |

### 3.3 States

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`isEditing\` | \`boolean\` | \`true\` | \`@propertyDataSource\` | Edit mode (true) or view mode (false) |
| \`disabled\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is disabled |
| \`readonly\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is read-only |
| \`required\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is required |
| \`loading\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Loading state |

### 3.4 Internal State

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`isOpen\` | \`boolean\` | \`false\` | \`@state\` | Time picker panel is open |

---

## 4. Value Contract

### Storage Format

- \`value\` is always stored in **24-hour format**: \`"HH:mm"\`
- When \`showSeconds=true\`: \`"HH:mm:ss"\`
- **No date component** — never store or emit date information
- \`null\` represents no value selected

### Display Format

Display respects \`hour12\` and \`locale\`. The stored value is never modified.

| \`hour12\` | Stored | Displayed |
|----------|--------|-----------|
| \`false\` | \`"14:30"\` | \`14:30\` |
| \`true\` | \`"14:30"\` | \`02:30 PM\` |
| \`false\` | \`"08:05:30"\` | \`08:05:30\` |
| \`true\` | \`"08:05:30"\` | \`08:05:30 AM\` |

### View Mode

- If \`value\` is \`null\`, display \`"—"\` (em dash)

---

## 5. Events

| Event | Detail | Bubbles | Description |
|-------|--------|:-------:|-------------|
| \`change\` | \`{ value: string \| null }\` | ✓ | Time confirmed or cleared |
| \`blur\` | \`{}\` | ✓ | Field lost focus |
| \`focus\` | \`{}\` | ✓ | Field received focus |

### Dispatch Example

\`\`\`typescript
this.dispatchEvent(new CustomEvent('change', {
  bubbles: true,
  composed: true,
  detail: { value: this.value } // "14:30" or null
}));
\`\`\`

---

## 6. isEditing Mode

| Mode | \`isEditing\` | Behavior |
|------|-------------|----------|
| **Edit** | \`true\` | Renders time input + picker panel |
| **View** | \`false\` | Renders formatted time as static text |

- In view mode: no input, no picker, no events, no error, no helper

---

## 7. Error Handling

| \`error\` value | Behavior |
|---------------|----------|
| \`''\` | No error — show Helper if slot exists |
| \`'any message'\` | Show error message, apply error visual state |

- Error never shown in view mode
- Page/Organism is responsible for setting the error message

---

## 8. Visual States

| State | Behavior |
|-------|----------|
| **Normal** | Default appearance |
| **Focus** | Highlighted border or outline |
| **Open** | Time picker panel visible |
| **Disabled** | Reduced opacity, no interaction |
| **Readonly** | No editing, text selectable |
| **Error** | Error border/style, error message visible |
| **Loading** | Loading indicator visible |
| **View Mode** | Formatted text only, no picker |

---

## 9. Rendering Logic

\`\`\`
RENDER:

IF isEditing === false (View Mode):
  1. IF hasSlot('Label'): render label
  2. Render formatted time string or "—"
  3. RETURN

IF isEditing === true (Edit Mode):
  1. Container — apply state styles

  2. IF hasSlot('Label'):
     - Render label
     - IF required: add indicator (*)

  3. Input field:
     - Masked text input (HH:mm or hh:mm AM/PM)
     - Clock icon — onClick: toggle isOpen

  4. IF loading: render loading indicator, do NOT open picker

  5. IF isOpen:
     - Hours column (00–23 or 01–12)
     - Minutes column (filtered by minuteStep)
     - IF showSeconds: seconds column (00–59)
     - IF hour12: AM/PM selector
     - Disable options outside minTime/maxTime
     - Confirm and Clear actions
     - On confirm: set value, emit change, close panel
     - On outside click: close without change

  6. Below input:
     IF error !== '': render error message
     ELSE IF hasSlot('Helper'): render helper text
\`\`\`

---

## 10. Value Handling

### minuteStep

- Only render minutes that are multiples of \`minuteStep\`
- Example: \`minuteStep=15\` → show 00, 15, 30, 45

### minTime / maxTime

- Disable hours/minutes outside the allowed range
- For boundary hours: disable only the out-of-range minutes

### showSeconds

- When \`false\`: store \`"HH:mm"\`, hide seconds column
- When \`true\`: store \`"HH:mm:ss"\`, show seconds column (always step 1)

### hour12

- Display only — never affects stored format
- Internally always convert to/from 24h

---

## 11. Accessibility (a11y)

| Requirement | Implementation |
|-------------|----------------|
| Associated label | \`aria-labelledby\` |
| Error announced | \`aria-describedby\` pointing to error element |
| Invalid state | \`aria-invalid="true"\` when error exists |
| Required field | \`aria-required="true"\` |
| Picker dialog | \`role="dialog"\`, \`aria-modal="true"\` |
| Current value | \`aria-label\` on trigger with formatted time |

---

## 12. Possible Implementations

| Component | Description |
|-----------|-------------|
| **Time Picker** | Input + scrollable columns panel |
| **Time Input** | Masked text input \`HH:mm\` |
| **Time Spinner** | Up/down arrows per segment |
| **Clock Face** | Analog clock for hour + minute selection |

---

## 13. Changelog

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-04-17 | Initial creation reference |

`;