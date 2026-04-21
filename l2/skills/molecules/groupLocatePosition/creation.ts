/// <mls fileReference="_102020_/l2/skills/molecules/groupLocatePosition/creation.ts" enhancement="_blank"/>

export const skill = `

# locate + position — Creation

> Implementation reference for creating molecules in the **locate + position** group.
> Follow the general Lit/Aura rules defined in \`molecule-generation2.md\`.

---

## 1. Metadata

| Field | Value |
|-------|-------|
| **Group** | \`locate + position\` |
| **Category** | Data Entry |
| **Version** | \`1.0.0\` |

---

## 2. Slot Tags

| Tag | Required | Description |
|-----|:--------:|-------------|
| \`Label\` | No | Label displayed above or beside the field |
| \`Helper\` | No | Help text displayed below the field |
| \`Trigger\` | No | Custom content for the geolocation button |
| \`Suggestions\` | No | Container for address suggestion items, populated by the page |
| \`Item\` | No | One suggestion inside \`<Suggestions>\`. Attribute: \`value\` = \`"lat,lng"\`. Content = address label |
| \`Empty\` | No | Content shown when no location is selected or no suggestions available |

\`\`\`typescript
slotTags = ['Label', 'Helper', 'Trigger', 'Suggestions', 'Item', 'Empty'];
\`\`\`

### Slot Hierarchy

\`\`\`
component (root)
├── <Label>
├── <Trigger>
├── <Suggestions>
│   └── <Item value="lat,lng">
├── <Empty>
└── <Helper>
\`\`\`

---


## 3. Properties

### 3.1 Data

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`value\` | \`string \| null\` | \`null\` | \`@propertyDataSource\` | Selected coordinates as \`"lat,lng"\` (e.g. \`"-23.55,-46.63"\`) or \`null\` |
| \`error\` | \`string\` | \`''\` | \`@propertyDataSource\` | Error message (empty = no error) |
| \`name\` | \`string\` | \`''\` | \`@propertyDataSource\` | Field name (for forms) |

### 3.2 Configuration

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`placeholder\` | \`string\` | \`''\` | \`@propertyDataSource\` | Placeholder text for the search input |
| \`showMap\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Show an embedded map preview of the selected location |
| \`allowGeolocation\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Show a button to use the browser's geolocation API |

### 3.3 States

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`isEditing\` | \`boolean\` | \`true\` | \`@propertyDataSource\` | Edit mode (true) or view mode (false) |
| \`disabled\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is disabled |
| \`readonly\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is read-only |
| \`required\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | A location is required |
| \`loading\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Loading state (e.g. fetching suggestions or resolving geolocation) |

### 3.4 Internal State

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`searchQuery\` | \`string\` | \`''\` | \`@state\` | Current text in the search input |
| \`isOpen\` | \`boolean\` | \`false\` | \`@state\` | Whether the suggestions panel is open |

---

## 4. Value Contract

### Storage Format

- \`value\` is a plain **string** in the format \`"lat,lng"\` (e.g. \`"-23.55,-46.63"\`)
- \`null\` means no location selected
- Parsing:

\`\`\`typescript
private parseValue(): { lat: number; lng: number } | null {
  if (!this.value) return null;
  const [lat, lng] = this.value.split(',').map(Number);
  return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
}
\`\`\`

### Suggestions via Slot Tags

Suggestions are provided by the page as \`<Item>\` elements inside \`<Suggestions>\`:

\`\`\`html
<Suggestions>
  <Item value="-23.55,-46.63">São Paulo, SP - Brazil</Item>
  <Item value="-22.90,-43.17">Rio de Janeiro, RJ - Brazil</Item>
</Suggestions>
\`\`\`

Read suggestions inline using \`getSlots\`:

\`\`\`typescript
const suggestionsContainer = this.getSlot('Suggestions');
const items = suggestionsContainer
  ? Array.from(suggestionsContainer.querySelectorAll('Item')).map(el => ({
      value: el.getAttribute('value') || '',
      label: el.innerHTML,
    }))
  : [];
\`\`\`

The page updates \`<Suggestions>\` content in response to the \`search\` event.

### View Mode

- If \`value\` is \`null\`: render Empty slot content or \`"—"\`
- Otherwise: find the matching \`<Item>\` label for the current value, or display the raw coordinates
- If \`showMap=true\`: render map preview with pin at the parsed lat/lng

---

## 5. Events

| Event | Detail | Bubbles | Description |
|-------|--------|:-------:|-------------|
| \`change\` | \`{ value: string \| null }\` | ✓ | Location confirmed — value is \`"lat,lng"\` or null |
| \`search\` | \`{ query: string }\` | ✓ | User typed in search input — page should update \`<Suggestions>\` items |
| \`blur\` | \`{}\` | ✓ | Field lost focus |
| \`focus\` | \`{}\` | ✓ | Field received focus |

### Search Flow

\`\`\`
User types in search input
  → emit \`search\` with { query }
  → Page calls BFF, updates <Suggestions> slot with <Item> elements
  → Component re-renders suggestion list
  → User selects a suggestion
  → Component sets value = item.value ("lat,lng"), emits \`change\`
  → isOpen = false, searchQuery = selected item label
\`\`\`

### Geolocation Flow

\`\`\`
User clicks geolocation button
  → browser navigator.geolocation.getCurrentPosition()
  → on success: set value = "lat,lng", emit \`change\`
  → emit \`search\` with { query: "lat,lng" } so page can resolve address
  → page updates <Suggestions> with resolved address
\`\`\`

### Dispatch Example

\`\`\`typescript
this.dispatchEvent(new CustomEvent('change', {
  bubbles: true,
  composed: true,
  detail: { value: this.value }
}));

this.dispatchEvent(new CustomEvent('search', {
  bubbles: true,
  composed: true,
  detail: { query: this.searchQuery }
}));
\`\`\`

---

## 6. isEditing Mode

| Mode | \`isEditing\` | Behavior |
|------|-------------|----------|
| **Edit** | \`true\` | Renders search input, suggestions panel, optional map |
| **View** | \`false\` | Renders address as static text, optional map |

- In view mode: no input, no suggestions, no search events, no error, no helper

---

## 7. Validation Rules

| Rule | Behavior |
|------|----------|
| \`required\` and \`value === null\` | Error state until a location is selected |
| No \`<Item>\` inside \`<Suggestions>\` | Render Empty slot or default "No results" message |

---

## 8. Error Handling

| \`error\` value | Behavior |
|---------------|----------|
| \`''\` | No error — show Helper if slot exists |
| \`'any message'\` | Show error message, apply error visual state |

- Error never shown in view mode
- Page/Organism is responsible for setting the error message

---

## 9. Visual States

| State | Behavior |
|-------|----------|
| **Normal** | Default appearance |
| **Focused** | Search input border highlighted |
| **Open** | Suggestions panel visible |
| **Selected** | Address displayed in input, map pin updated |
| **Disabled** | Reduced opacity, no interaction |
| **Readonly** | No editing, text selectable |
| **Error** | Error border/style, error message visible |
| **Loading** | Loading indicator; suggestions panel disabled |
| **View Mode** | Address as plain text, optional map |

---

## 10. Rendering Logic

\`\`\`
RENDER:

IF isEditing === false (View Mode):
  1. IF hasSlot('Label'): render label
  2. Parse value → { lat, lng } or null
     IF value: find matching <Item> label or display raw "lat, lng"
     ELSE: render Empty slot or "—"
  3. IF showMap AND value: render map preview with pin at lat/lng
  4. RETURN

IF isEditing === true (Edit Mode):
  1. Container — apply state styles

  2. IF hasSlot('Label'): render label

  3. Search input row:
     - Text input bound to searchQuery
       - @input: update searchQuery, emit \`search\`, set isOpen=true
       - @focus: emit \`focus\` event
       - @blur: emit \`blur\` event
       - placeholder from prop or i18n default
     - IF allowGeolocation: render geolocation button
       - IF hasSlot('Trigger'): use Trigger content as button label
       - @click: call navigator.geolocation.getCurrentPosition()
     - IF loading: render loading indicator, disable input and button

  4. IF isOpen AND hasSlot('Suggestions'):
     - Read items from <Suggestions> slot:
       const items = Array.from(suggestionsEl.querySelectorAll('Item')).map(...)
     - IF items.length > 0:
         FOR each item: render address row (unsafeHTML for label)
           Highlight if item.value === value
           @click: set value = item.value, searchQuery = item.label
                   isOpen = false, emit \`change\`
     - ELSE: render Empty slot or default "No results" message

  5. IF showMap AND value:
     - Parse value → { lat, lng }
     - Render map preview with pin at lat/lng

  6. Below input:
     IF error !== '': render error message
     ELSE IF hasSlot('Helper'): render helper text
\`\`\`

---

## 11. Accessibility (a11y)

| Requirement | Implementation |
|-------------|----------------|
| Search input | \`role="combobox"\`, \`aria-expanded\`, \`aria-autocomplete="list"\` |
| Suggestions panel | \`role="listbox"\` |
| Suggestion items | \`role="option"\`, \`aria-selected\` |
| Label | \`aria-labelledby\` pointing to rendered label |
| Error | \`aria-describedby\` pointing to error element |
| Invalid | \`aria-invalid="true"\` when error exists |
| Required | \`aria-required="true"\` |
| Geolocation button | \`aria-label="Use current location"\` |

---

## 12. Changelog

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-04-20 | Initial creation reference |
| 1.1.0 | 2026-04-21 | Suggestions via Slot Tags; value simplified to "lat,lng" string |
`;
