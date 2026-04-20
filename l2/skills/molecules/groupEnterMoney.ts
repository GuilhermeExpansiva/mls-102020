/// <mls fileReference="_102020_/l2/skills/molecules/groupEnterMoney.ts" enhancement="_blank"/>

export const skill = `

# Skill Group Contract: \`enter + money\`
> Official contract for molecules in the **enter + money** group in the Collab Aura system.

---

## 1. Metadata

| Field | Value |
|-------|-------|
| **Group** | \`enter + money\` |
| **Category** | Data Entry |
| **Intent** | User wants to provide a **monetary value** |
| **Version** | \`1.1.0\` |

---

## 2. When to Use

- Price input
- Payment amounts
- Budget and cost fields
- Financial transactions
- Salary and wages
- Discounts and fees

---

## 3. When NOT to Use

| Scenario | Use instead |
|----------|-------------|
| Generic numbers (quantities, measurements) | \`enter + number\` |
| Percentages | \`enter + number\` |
| Free-form text | \`enter + text\` |
| Date/time | \`enter + datetime\` |

---

## 4. Slot Tags

| Tag | Required | Description |
|-----|:--------:|-------------|
| \`Label\` | No | Field label |
| \`Prefix\` | No | Content before input (custom currency symbol) |
| \`Suffix\` | No | Content after input (currency code, actions) |
| \`Helper\` | No | Help text displayed below the field |
> **Note:** There is no \`Error\` slot tag. Error messages are controlled via the \`error\` property.

### HTML Structure

\`\`\`html
<molecules--currency-input-102020 
  value="{{ui.form.price}}" 
  error="{{ui.form.priceError}}"
  currency="BRL" 
  locale="pt-BR" 
  required>
  <Label>Product Price</Label>
  <Helper>Minimum value is R$ 10.00</Helper>
</molecules--currency-input-102020>
\`\`\`

---

## 5. Properties

### 5.1 Data

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`value\` | \`number \\| null\` | \`null\` | \`@propertyDataSource\` | Raw numeric value (unformatted) |
| \`error\` | \`string\` | \`''\` | \`@propertyDataSource\` | Error message (empty = no error) |

### 5.2 Configuration

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`name\` | \`string\` | \`''\` | \`@propertyDataSource\` | Field name (for forms) |
| \`currency\` | \`string\` | \`'USD'\` | \`@propertyDataSource\` | ISO 4217 currency code |
| \`locale\` | \`string\` | \`''\` | \`@propertyDataSource\` | Locale for formatting (e.g., 'pt-BR') |
| \`min\` | \`number\` | \`0\` | \`@propertyDataSource\` | Minimum allowed value |
| \`max\` | \`number\` | \`0\` | \`@propertyDataSource\` | Maximum allowed value (0 = no limit) |
| \`placeholder\` | \`string\` | \`''\` | \`@propertyDataSource\` | Placeholder text |
| \`showSymbol\` | \`boolean\` | \`true\` | \`@propertyDataSource\` | Show currency symbol |
| \`symbolPosition\` | \`string\` | \`'prefix'\` | \`@propertyDataSource\` | Symbol position: 'prefix' or 'suffix' |
| \`allowNegative\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Allow negative values |

### 5.3 States

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`disabled\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is disabled |
| \`readonly\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is read-only |
| \`required\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Field is required |
| \`loading\` | \`boolean\` | \`false\` | \`@propertyDataSource\` | Loading state |
| \`isEditing\` | \`boolean\` | \`true\` | \`@propertyDataSource\` | Edit mode (true) or view mode (false) |

### 5.4 Internal State

| Property | Type | Default | Decorator | Description |
|----------|------|---------|-----------|-------------|
| \`isFocused\` | \`boolean\` | \`false\` | \`@state\` | Field has focus (internal) |
| \`inputValue\` | \`string\` | \`''\` | \`@state\` | Temporary value during typing (internal) |

### 5.5 Common Currency Codes (ISO 4217)

| Code | Currency | Symbol | Decimals |
|------|----------|--------|----------|
| \`USD\` | US Dollar | $ | 2 |
| \`EUR\` | Euro | € | 2 |
| \`BRL\` | Brazilian Real | R$ | 2 |
| \`GBP\` | British Pound | £ | 2 |
| \`JPY\` | Japanese Yen | ¥ | 0 |
| \`CNY\` | Chinese Yuan | ¥ | 2 |

### 5.6 Locale Formatting Examples

| Locale | Value | Formatted |
|--------|-------|-----------|
| \`en-US\` | 1234.56 | $1,234.56 |
| \`pt-BR\` | 1234.56 | R$ 1.234,56 |
| \`de-DE\` | 1234.56 | 1.234,56 € |
| \`fr-FR\` | 1234.56 | 1 234,56 € |
| \`ja-JP\` | 1234 | ¥1,234 |

---

## 6. Error Handling

### 6.1 Error Property

The \`error\` property is a \`string\` with \`@propertyDataSource\`:
- **Empty string (\`''\`)**: No error, normal state
- **Non-empty string**: Error state, message is displayed

### 6.2 Validation Responsibility

The **Page/Organism** is responsible for:
- Validating the value
- Setting the error message
- Clearing the error when corrected

### 6.3 Example

\`\`\`typescript
// In Page: validate on blur
handleBlur(value: number | null) {
  if (value !== null && value < 10) {
    this.setState('ui.form.priceError', 'Minimum value is R$ 10.00');
  } else {
    this.setState('ui.form.priceError', '');
  }
}
\`\`\`

---

## 7. Events

| Event | Detail | Bubbles | Description |
|-------|--------|:-------:|-------------|
| \`change\` | \`{ value: number \\| null, formatted: string }\` | ✓ | Value changed (after blur or enter) |
| \`input\` | \`{ value: number \\| null, formatted: string }\` | ✓ | Value changed (on each keystroke) |
| \`blur\` | \`{}\` | ✓ | Field lost focus |
| \`focus\` | \`{}\` | ✓ | Field received focus |
| \`enter\` | \`{ value: number \\| null, formatted: string }\` | ✓ | User pressed Enter |

### Event Dispatch Example

\`\`\`typescript
this.dispatchEvent(new CustomEvent('change', {
  bubbles: true,
  composed: true,
  detail: { 
    value: this.value,           // 1234.56
    formatted: this.formatted    // "R$ 1.234,56"
  }
}));
\`\`\`

---

## 8. isEditing Mode

### 8.1 Behavior

| Mode | isEditing | Behavior |
|------|-----------|----------|
| **Edit** | \`true\` | Shows input field, user can type |
| **View** | \`false\` | Shows formatted value as text |

### 8.2 View Mode Display

When \`isEditing="false"\`:
- Display formatted value with currency symbol (e.g., "R$ 1.234,56")
- If \`value\` is \`null\`, display "—" (em dash)
- No input interaction
- Text is selectable but not editable

---

## 9. Visual States

| State | Behavior |
|-------|----------|
| **Normal** | Default appearance, text cursor |
| **Focus** | Highlighted border or outline |
| **Hover** | Subtle visual feedback |
| **Disabled** | Reduced opacity, no interaction |
| **Readonly** | No editing allowed, text selectable |
| **Error** | Error border/style, error message visible |
| **Loading** | Loading indicator visible |
| **View Mode** | Formatted text only, no input |

---

## 10. Rendering Logic

\`\`\`
RENDER:

1. IF isEditing === false:
   - Render view mode (formatted text or "—")
   - RETURN

2. Main container
   - Apply state styles (disabled, error, etc.)

3. IF hasSlot('Label'):
   - Render label above input
   - IF required: add visual indicator (*)

4. Input wrapper:
   a. IF showSymbol AND symbolPosition === 'prefix':
      - Render currency symbol on the left
   ELSE IF hasSlot('Prefix'):
      - Render Prefix content on the left
   
   b. Input element:
      - Display formatted value while editing
      - Apply mask as user types
      - Events: input, change, blur, focus, keydown
   
   c. IF loading:
      - Render loading indicator
   ELSE IF showSymbol AND symbolPosition === 'suffix':
      - Render currency symbol on the right
   ELSE IF hasSlot('Suffix'):
      - Render Suffix content on the right

5. Below input:
   IF error !== '':
      - Render error message (from error property)
   ELSE IF hasSlot('Helper'):
      - Render help text
\`\`\`

---

## 11. Value Handling

### Input Behavior

| Action | Behavior |
|--------|----------|
| Typing | Format as user types with thousand separators |
| Focus | Select all text for easy replacement |
| Blur | Apply final formatting |
| Paste | Parse and format pasted value |

### Formatting Rules

| Rule | Description |
|------|-------------|
| Thousand separator | Based on locale (comma or period or space) |
| Decimal separator | Based on locale (period or comma) |
| Decimal places | Based on currency (usually 2, JPY = 0) |
| Symbol position | Based on locale or explicit property |
| Negative format | Parentheses or minus sign based on locale |

### Value Storage

- \`value\` property always stores raw number (e.g., \`1234.56\`)
- Display shows formatted string (e.g., \`R$ 1.234,56\`)
- Events include both \`value\` and \`formatted\`

---

## 12. Accessibility (a11y)

| Requirement | Implementation |
|-------------|----------------|
| Associated label | \`aria-labelledby\` or \`<label for>\` |
| Error announced | \`aria-describedby\` pointing to error |
| Invalid state | \`aria-invalid="true"\` when error |
| Required field | \`aria-required="true"\` |
| Value bounds | \`aria-valuemin\`, \`aria-valuemax\` |
| Current value | \`aria-valuenow\` (raw number) |
| Helper text | \`aria-describedby\` including helper |

---

## 13. Possible Implementations

| Component | Description | Characteristics |
|-----------|-------------|-----------------|
| **Currency Input** | Standard money field | Single currency, locale formatting |
| **Price Field** | Price with currency selector | Dropdown to change currency |
| **Money Input** | Masked money entry | Real-time formatting as you type |
| **Currency Converter** | Dual currency fields | Convert between two currencies |
| **Payment Amount** | Optimized for checkout | Quick amount buttons, validation |

---

## 14. Changelog

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-04-15 | Initial contract version |
| 1.1.0 | 2026-04-16 | Removed Error slot tag, error is now @propertyDataSource string, added isEditing mode |
| 1.2.0 | 2026-04-16 | All external properties are now @propertyDataSource, only internal controls use @state |
`