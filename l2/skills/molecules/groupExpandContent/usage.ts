/// <mls fileReference="_102020_/l2/skills/molecules/groupExpandContent/usage.ts" enhancement="_blank"/>

export const skill = `
# expand + content — Usage

> Quick reference for using molecules in the **expand + content** group.
> Use this when the user needs to **expand or collapse content** to see more or less details.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Title displayed above the component |
| \`Section\` | One expandable section. Attributes: \`title\` (required), \`disabled\` (presence), \`expanded\` (presence). Content = the collapsible body |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`multiple\` | \`boolean\` | \`true\` | Allow multiple sections open at once. \`false\` = only one (accordion mode) |
| \`disabled\` | \`boolean\` | \`false\` | Disables all sections |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading placeholder |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`toggle\` | \`{ index: number, title: string, expanded: boolean }\` | Fired when a section is expanded or collapsed |

---

## Examples

### FAQ accordion (one at a time)

\`\`\`html
<molecules--accordion-102020
  multiple="false">
  <Label>Frequently Asked Questions</Label>
  <Section title="How do I reset my password?">
    Go to Settings > Security > Reset Password and follow the instructions.
  </Section>
  <Section title="Can I change my plan?">
    Yes, you can upgrade or downgrade at any time from the Billing page.
  </Section>
  <Section title="How do I contact support?">
    Use the chat widget or email support@example.com.
  </Section>
</molecules--accordion-102020>
\`\`\`

`;
