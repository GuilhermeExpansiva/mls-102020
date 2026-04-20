/// <mls fileReference="_102020_/l2/molecules/groupEnterMoney/inputCurrency.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// INPUT CURRENCY MOLECULE
// =============================================================================
// Skill Group: groupEnterMoney (enter + money)
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Enter amount',
  loading: 'Loading...',
  empty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Digite o valor',
    loading: 'Carregando...',
    empty: '—',
  },
};
/// **collab_i18n_end**
@customElement('molecules--group-enter-money--input-currency-102020')
export class GroupEnterMoneyInputCurrencyMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;
  @propertyDataSource({ type: String })
  error: string = '';
  @propertyDataSource({ type: String })
  name: string = '';
  @propertyDataSource({ type: String })
  currency: string = 'USD';
  @propertyDataSource({ type: String })
  locale: string = '';
  @propertyDataSource({ type: Number })
  decimals: number = 2;
  @propertyDataSource({ type: Number })
  min: number | null = null;
  @propertyDataSource({ type: Number })
  max: number | null = null;
  @propertyDataSource({ type: Boolean })
  showSymbol: boolean = true;
  @propertyDataSource({ type: String })
  placeholder: string = '';
  @propertyDataSource({ type: Boolean })
  isEditing: boolean = true;
  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;
  @propertyDataSource({ type: Boolean })
  readonly: boolean = false;
  @propertyDataSource({ type: Boolean })
  required: boolean = false;
  @propertyDataSource({ type: Boolean })
  loading: boolean = false;
  // ===========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private rawValue: string = '';
  @state()
  private isFocused: boolean = false;
  // ===========================================================================
  // STATE CHANGE HANDLER (for derived rawValue)
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    // Update rawValue if value changes externally
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.rawValue = this.formatToRaw(value);
    }
    this.requestUpdate();
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleFocus(e: FocusEvent) {
    this.isFocused = true;
    // Select all text on focus
    const input = e.target as HTMLInputElement;
    input.select();
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.rawValue = input.value;
    this.value = this.parseLocaleNumber(this.rawValue);
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }
  private handleBlur() {
    this.isFocused = false;
    // On blur: parse, clamp, normalize
    let parsed = this.parseLocaleNumber(this.rawValue);
    if (parsed === null || isNaN(parsed)) {
      parsed = null;
    }
    // Clamp to min/max
    if (parsed !== null) {
      if (this.min !== null && parsed < this.min) parsed = this.min;
      if (this.max !== null && parsed > this.max) parsed = this.max;
      if (this.min !== null && this.min >= 0 && parsed < 0) parsed = this.min;
    }
    this.value = parsed;
    this.rawValue = this.formatToRaw(parsed);
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }
  // ===========================================================================
  // FORMAT/PARSE HELPERS
  // ==========================================================================
  private getLocale(): string {
    // Use explicit locale, fallback to browser, then 'en-US'
    return this.locale || navigator.language || 'en-US';
  }
  private getCurrency(): string {
    return this.currency || 'USD';
  }
  private getDecimals(): number {
    return typeof this.decimals === 'number' ? this.decimals : 2;
  }
  private getPlaceholder(): string {
    return this.placeholder || this.msg.placeholder;
  }
  private getSymbol(): string {
    // Get currency symbol for display
    try {
      const locale = this.getLocale();
      const currency = this.getCurrency();
      const nf = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: this.getDecimals(),
        maximumFractionDigits: this.getDecimals(),
      });
      // Format 1 and extract symbol
      const parts = nf.formatToParts(1);
      const symbolPart = parts.find(p => p.type === 'currency');
      return symbolPart ? symbolPart.value : currency;
    } catch {
      return this.getCurrency();
    }
  }
  private formatToRaw(value: number | null): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    const locale = this.getLocale();
    const decimals = this.getDecimals();
    // Format as plain number (no symbol)
    try {
      return value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      return value.toFixed(decimals);
    }
  }
  private formatToDisplay(value: number | null): string {
    if (value === null || value === undefined || isNaN(value)) return this.msg.empty;
    const locale = this.getLocale();
    const currency = this.getCurrency();
    const decimals = this.getDecimals();
    try {
      if (this.showSymbol) {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
      } else {
        return value.toLocaleString(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      }
    } catch {
      return value.toFixed(decimals);
    }
  }
  private parseLocaleNumber(raw: string): number | null {
    if (!raw) return null;
    const locale = this.getLocale();
    // Determine separators
    let decimalSep = '.';
    let thousandSep = ',';
    if (locale.startsWith('pt')) {
      decimalSep = ',';
      thousandSep = '.';
    } else if (locale.startsWith('de')) {
      decimalSep = ',';
      thousandSep = '.';
    } else if (locale.startsWith('fr')) {
      decimalSep = ',';
      thousandSep = ' '; // NBSP
    } else {
      decimalSep = '.';
      thousandSep = ',';
    }
    // Remove all except digits, minus, and decimalSep
    let cleaned = raw.replace(new RegExp(`[^\d\-\${decimalSep}]`, 'g'), '');
    // Replace decimalSep with '.'
    if (decimalSep !== '.') {
      const last = cleaned.lastIndexOf(decimalSep);
      if (last !== -1) {
        cleaned = cleaned.slice(0, last).replace(new RegExp(`\${decimalSep}`, 'g'), '') + '.' + cleaned.slice(last + 1);
      }
    }
    // Remove leading zeros (except for decimals)
    if (/^0[0-9]/.test(cleaned)) {
      cleaned = cleaned.replace(/^0+/, '');
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    // Loading state
    if (this.loading) {
      return html`<div class="flex items-center gap-2 text-slate-400 text-sm"><span class="animate-pulse">${this.msg.loading}</span></div>`;
    }
    // View mode
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col gap-1">
          ${this.hasSlot('Label') ? html`<div class="text-xs font-medium text-slate-700 mb-1" id="label">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
          <div class="text-base text-slate-900" aria-labelledby="label">
            ${this.formatToDisplay(this.value)}
          </div>
        </div>
      `;
    }
    // Edit mode
    const hasError = !!this.error;
    const symbol = this.showSymbol ? this.getSymbol() : '';
    const inputId = `input-currency-${this.name || 'field'}`;
    const labelId = this.hasSlot('Label') ? 'label' : undefined;
    const describedBy = hasError ? 'error' : (this.hasSlot('Helper') ? 'helper' : undefined);
    return html`
      <div class="flex flex-col gap-1">
        <!-- Label -->
        ${this.hasSlot('Label') ? html`<div class="text-xs font-medium text-slate-700 mb-1" id="label">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
        <!-- Input Row -->
        <div class="flex items-center relative">
          ${this.showSymbol ? html`<span class="absolute left-3 text-slate-400 select-none pointer-events-none">${symbol}</span>` : nothing}
          <input
            id="${inputId}"
            class="w-full rounded-md border px-3 py-2 text-base bg-white transition focus:outline-none focus:ring-2 ${
              hasError
                ? 'border-red-500 focus:ring-red-200'
                : this.isFocused
                  ? 'border-sky-500 focus:ring-sky-200'
                  : 'border-slate-300 focus:ring-sky-100'
            } ${this.disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''} ${this.readonly ? 'bg-slate-50' : ''} ${this.showSymbol ? 'pl-9' : ''}"
            type="text"
            inputmode="decimal"
            .value="${this.rawValue}"
            ?disabled="${this.disabled || this.loading}"
            ?readonly="${this.readonly}"
            aria-labelledby="${labelId || ''}"
            aria-describedby="${describedBy || ''}"
            aria-invalid="${hasError ? 'true' : 'false'}"
            aria-required="${this.required ? 'true' : 'false'}"
            aria-label="${this.showSymbol ? '' : this.getCurrency()}"
            placeholder="${this.getPlaceholder()}"
            @focus="${this.handleFocus}"
            @input="${this.handleInput}"
            @blur="${this.handleBlur}"
            autocomplete="off"
            spellcheck="false"
          />
        </div>
        <!-- Error or Helper -->
        ${hasError
          ? html`<div class="text-xs text-red-600 mt-1" id="error">${this.error}</div>`
          : this.hasSlot('Helper')
            ? html`<div class="text-xs text-slate-500 mt-1" id="helper">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
            : nothing}
      </div>
    `;
  }
}
