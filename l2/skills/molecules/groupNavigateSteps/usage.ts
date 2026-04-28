/// <mls fileReference="_102020_/l2/skills/molecules/groupNavigateSteps/usage.ts" enhancement="_blank"/>

export const skill = `
# navigate + steps — Usage

> Quick reference for using molecules in the **navigate + steps** group.
> Use this when the user needs to **advance through a sequential multi-step process**.
> The component renders the step indicators; the page is responsible for displaying each step's content.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Title displayed above the stepper |
| \`Step\` | One step in the process. Attributes: \`title\` (required), \`description\` (optional), \`completed\` (presence), \`disabled\` (presence) |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`value\` | \`number\` | \`0\` | Index of the current active step (0-based) |
| \`linear\` | \`boolean\` | \`true\` | Steps must be completed in order. \`false\` = can jump freely |
| \`disabled\` | \`boolean\` | \`false\` | Disables all navigation |
| \`loading\` | \`boolean\` | \`false\` | Shows loading state |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`change\` | \`{ value: number, title: string }\` | Fired when the active step changes |

---

## Value Format

- \`value\` is a **number** (0-based index) of the current step
- The page reads \`value\` to decide which content to show
- Navigation updates \`value\` and emits \`change\`

---

## Examples

### Checkout process (linear)

\`\`\`html
<molecules--stepper-102020
  value="{{ui.checkout.currentStep}}"
  linear="true">
  <Label>Checkout</Label>
  <Step title="Cart" completed></Step>
  <Step title="Shipping" completed></Step>
  <Step title="Payment"></Step>
  <Step title="Confirmation"></Step>
</molecules--stepper-102020>
\`\`\`

`;