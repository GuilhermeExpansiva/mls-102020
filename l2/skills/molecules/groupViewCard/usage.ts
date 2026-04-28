/// <mls fileReference="_102020_/l2/skills/molecules/groupViewCard/usage.ts" enhancement="_blank"/>

export const skill = `

# view + card — Usage

> Quick reference for using molecules in the **view + card** group.
> Use this when you need to **display an item as an independent visual unit**.
> This is a composition primitive — the page or organism arranges cards in grids, lists, carousels, etc.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`CardHeader\` | Top section, typically contains title and description |
| \`CardTitle\` | Main title text inside the header |
| \`CardDescription\` | Secondary text inside the header |
| \`CardContent\` | Main body area |
| \`CardFooter\` | Bottom section |
| \`CardAction\` | Actionable element (button, link) |

All slots are optional. The card renders only what is present.

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`clickable\` | \`boolean\` | \`false\` | Entire card is clickable |
| \`selected\` | \`boolean\` | \`false\` | Card is visually highlighted |
| \`disabled\` | \`boolean\` | \`false\` | Card is dimmed and non-interactive |
| \`loading\` | \`boolean\` | \`false\` | Show skeleton placeholder instead of content |
| \`isEditing\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Change all children web components, atribute is-editing  |
---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`cardClick\` | \`{}\` | Fired when the card is clicked (only when \`clickable=true\`) |

---

## Examples

### Basic product card

\`\`\`html
<molecules--card-102020>
  <CardHeader>
    <CardTitle>Wireless Headphones</CardTitle>
    <CardDescription>Noise cancelling, 30h battery</CardDescription>
  </CardHeader>
  <CardContent>
    <img src="headphones.jpg" alt="Headphones" />
  </CardContent>
  <CardFooter>$299.00</CardFooter>
</molecules--card-102020>
\`\`\`

`;