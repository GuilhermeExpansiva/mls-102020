/// <mls fileReference="_102020_/l2/skills/molecules/groupViewMetric/usage.ts" enhancement="_blank"/>

export const skill = `

# groupviewMetric — Usage

> Quick reference for using molecules in the **view + metric** group.
> Use this when the user needs to **view a highlighted indicator or metric**.
> Purely visual — all data provided via slot tags.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Metric name/title |
| \`Value\` | The main metric value (formatted number, text, HTML) |
| \`Icon\` | Icon displayed alongside the metric |
| \`Trend\` | Trend indicator. Attribute: \`direction\` (\`'up'\`, \`'down'\`, \`'neutral'\`). Content = free (arrow, percentage, text) |
| \`Helper\` | Supporting text below (period, comparison, context) |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`loading\` | \`boolean\` | \`false\` | Show skeleton placeholder instead of metric |

---

## Events

None. This component is purely visual.

---

## Examples

### Big number — monthly revenue

\`\`\`html
<molecules--big-number-102020>
  <Label>Monthly Revenue</Label>
  <Value>$127,450</Value>
  <Trend direction="up">↑ 12.5%</Trend>
  <Helper>vs last month</Helper>
</molecules--big-number-102020>
\`\`\`


`;