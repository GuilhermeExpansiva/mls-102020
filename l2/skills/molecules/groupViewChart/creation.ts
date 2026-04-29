/// <mls fileReference="_102020_/l2/skills/molecules/groupViewChart/creation.ts" enhancement="_blank"/>

export const skill = `
# groupViewChart — Creation

> Implementation reference for creating molecules in the **groupViewChart** group.
> Follow the general Lit/Aura rules defined in \`molecule-generation2.md\`.

---

## 1. Metadata

| Field | Value |
|-------|-------|
| **Group** | \`groupViewChart\` |
| **Category** | Data Display |
| **Version** | \`1.0.0\` |

---

## 2. Slot Tags

| Tag | Required | Description |
|-----|:--------:|-------------|
| \`Label\` | No | Chart title displayed above the chart |
| \`Series\` | No | Named data series. Attributes: \`name\` (required), \`color\`. Contains \`<Point>\` children |
| \`Point\` | Yes | Single data point. Attributes: \`label\` (required), \`value\` (required), \`color\` |
| \`Empty\` | No | Content shown when no data is provided |

\`\`\`typescript
slotTags = ['Label', 'Series', 'Point', 'Empty'];
\`\`\`

### Slot Hierarchy

\`\`\`
component (root)
├── <Label>
├── <Series name="..." color="...">
│   └── <Point label="..." value="..." />
├── <Point label="..." value="..." color="..." />
└── <Empty>
\`\`\`

### Single Series vs Multi Series

- **Multi series:** \`<Point>\` inside \`<Series>\`. Each series has its own \`name\` and \`color\`
- **Single series:** \`<Point>\` directly in the root (no \`<Series>\` wrapper). Used for Pie, Donut, Funnel, and simple charts. Each Point can have its own \`color\`

---

## 3. Properties

### 3.1 Configuration

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`showLegend\` | \`boolean\` | \`true\` | \`@propertyDataSource\` | Display the legend |
| \`showValues\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Display numeric values on data points |

### 3.2 States

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`loading\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Loading state — show placeholder instead of chart |

---

## 4. Value Contract

This component has **no \`value\` property**. It is a display-only component. Data comes entirely from slot tags.

---

## 5. Events

| Event | Detail | Bubbles | Description |
|-------|--------|:-------:|-------------|
| \`pointClick\` | \`{ label: string, value: number, series?: string }\` | ✓ | Fired when the user clicks a data point |

### Dispatch Example

\`\`\`typescript
this.dispatchEvent(new CustomEvent('pointClick', {
  bubbles: true,
  composed: true,
  detail: { label: 'Jan', value: 1200, series: '2024' }
}));
\`\`\`

---

## 6. Reading Data

- **Multi series:** read \`<Series>\` elements, each containing nested \`<Point>\` elements. Series has \`name\` and \`color\` attributes. Points have \`label\` and \`value\`
- **Standalone points:** read root-level \`<Point>\` elements (not inside a \`<Series>\`). Each has \`label\`, \`value\`, and optional \`color\`
- Use \`getSlots\` from the base class to read slot tag elements from the template

---

## 7. Visual States

| State | Behavior |
|-------|----------|
| **Normal** | Chart rendered with data |
| **Loading** | Placeholder or skeleton instead of chart |
| **Empty** | No points provided — render empty state message |
| **Hover** | Tooltip with point details on hover |

---

## 8. Rendering Logic

\`\`\`
RENDER:

1. IF hasSlot('Label'): render chart title

2. IF loading: render loading placeholder, RETURN

3. Read data:
   - series = read <Series> with nested <Point>
   - standalonePoints = read root-level <Point>

4. IF no series AND no standalonePoints: render Empty slot or default message, RETURN

5. Render chart:
   - Implementation-specific (bar, line, pie, etc.)
   - IF showValues: render value labels on data points
   - On each data point:
     - @mouseenter: show tooltip with label, value, series name
     - @mouseleave: hide tooltip
     - @click: emit \`pointClick\` event

6. IF showLegend AND series.length > 0:
   Render legend with series name + color for each series

7. IF showLegend AND standalonePoints.length > 0:
   Render legend with label + color for each point
\`\`\`

---

## 9. Accessibility (a11y)

| Requirement | Implementation |
|-------------|----------------|
| Container | \`role="img"\` with \`aria-label\` from Label slot content |
| Data table | Provide a visually hidden \`<table>\` with the raw data as alternative |
| Interactive points | \`role="button"\`, \`aria-label\` with label + value |

---

## 10. Changelog

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-04-21 | Initial creation reference |
| 1.1.0 | 2026-04-21 | Removed animate, width, height props; added Empty slot; removed implementation code |
`;
