/// <mls fileReference="_102020_/l2/molecules/groupEnterText/textareaWithCounter.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TEXTAREA WITH COUNTER MOLECULE
// =============================================================================
// Skill Group: groupEnterText (enter + text)
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Enter text...',
  loading: 'Loading...',
  empty: '—',
  password: '••••••••',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Digite o texto...',
    loading: 'Carregando...',
    empty: '—',
    password: '••••••••',
  },
};
/// **collab_i18n_end**
@customElement('molecules--group-enter-text--textarea-with-counter-102020')
export class TextareaWithCounterMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: String })
  value: string = '';

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Number, attribute: 'max-length' })
  maxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'min-length' })
  minLength: number | null = null;

  @propertyDataSource({ type: Number })
  rows: number = 1;

  @propertyDataSource({ type: String })
  autocomplete: string = '';

  @propertyDataSource({ type: String, attribute: 'input-type' })
  inputType: string = 'text';

  @propertyDataSource({ type: String })
  mask: string = '';

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
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
  private isFocused = false;

  @state()
  private rawDisplay: string = '';

  // ===========================================================================
  // LIFECYCLE
  // ==========================================================================
  connectedCallback() {
    super.connectedCallback();
    this.rawDisplay = this.getDisplayValue(this.value);
  }

  // ===========================================================================
  // STATE CHANGE HANDLER (for derived values)
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    // If value changes externally, update rawDisplay
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.rawDisplay = this.getDisplayValue(value);
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // MASK/FORMAT HELPERS
  // ==========================================================================
  private getDisplayValue(val: string): string {
    if (!this.mask) return val || '';
    return this.applyMask(val, this.mask);
  }

  private applyMask(raw: string, mask: string): string {
    if (!mask) return raw;
    let result = '';
    let rawIdx = 0;
    for (let i = 0; i < mask.length; i++) {
      const m = mask[i];
      if (rawIdx >= raw.length) break;
      if (m === '#') {
        // Digit only
        while (rawIdx < raw.length && !/\d/.test(raw[rawIdx])) rawIdx++;
        if (rawIdx < raw.length) {
          result += raw[rawIdx];
          rawIdx++;
        }
      } else if (m === 'A') {
        // Letter only
        while (rawIdx < raw.length && !/[a-zA-Z]/.test(raw[rawIdx])) rawIdx++;
        if (rawIdx < raw.length) {
          result += raw[rawIdx];
          rawIdx++;
        }
      } else if (m === '*') {
        // Any character
        result += raw[rawIdx];
        rawIdx++;
      } else {
        // Literal
        result += m;
      }
    }
    return result;
  }

  private extractRawFromMask(masked: string, mask: string): string {
    // Remove all literal mask chars, keep only chars that match mask slots
    let raw = '';
    let maskIdx = 0;
    let maskedIdx = 0;
    while (maskIdx < mask.length && maskedIdx < masked.length) {
      const m = mask[maskIdx];
      const c = masked[maskedIdx];
      if (m === '#') {
        if (/\d/.test(c)) raw += c;
        maskedIdx++;
        maskIdx++;
      } else if (m === 'A') {
        if (/[a-zA-Z]/.test(c)) raw += c;
        maskedIdx++;
        maskIdx++;
      } else if (m === '*') {
        raw += c;
        maskedIdx++;
        maskIdx++;
      } else {
        // Literal, skip if matches
        if (c === m) maskedIdx++;
        maskIdx++;
      }
    }
    return raw;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleInput(e: Event) {
    if (this.disabled || this.readonly) return;
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    let val = target.value;
    let raw = val;
    if (this.mask && this.rows === 1) {
      // Only apply mask for single-line input
      raw = this.extractRawFromMask(val, this.mask);
      val = this.applyMask(raw, this.mask);
      this.rawDisplay = val;
    } else {
      this.rawDisplay = val;
    }
    // Enforce maxLength
    if (this.maxLength !== null && raw.length > this.maxLength) {
      raw = raw.slice(0, this.maxLength);
      this.rawDisplay = this.mask ? this.applyMask(raw, this.mask) : raw;
    }
    this.value = raw;
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
    this.requestUpdate();
  }

  private handleBlur() {
    this.isFocused = false;
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

  private handleFocus() {
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private renderLabel(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Label')) return nothing;
    return html`<div id="label" class="mb-1 text-sm font-medium text-slate-700">
      ${unsafeHTML(this.getSlotContent('Label'))}
      ${this.required ? html`<span class="text-red-500">*</span>` : nothing}
    </div>`;
  }

  private renderHelperOrError(): TemplateResult | typeof nothing {
    if (!this.isEditing) return nothing;
    if (this.error) {
      return html`<div id="error" class="mt-1 text-xs text-red-600">${this.error}</div>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<div id="helper" class="mt-1 text-xs text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
    }
    return nothing;
  }

  private renderPrefix(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Prefix')) return nothing;
    return html`<span class="mr-2 flex items-center">${unsafeHTML(this.getSlotContent('Prefix'))}</span>`;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Suffix')) return nothing;
    return html`<span class="ml-2 flex items-center">${unsafeHTML(this.getSlotContent('Suffix'))}</span>`;
  }

  private renderLoading(): TemplateResult {
    return html`<span class="ml-2 animate-spin text-slate-400" aria-label="${this.msg.loading}">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </span>`;
  }

  private renderCharCounter(): TemplateResult | typeof nothing {
    if (this.rows <= 1 || this.maxLength === null) return nothing;
    const count = this.value.length;
    return html`<div class="mt-1 text-xs text-slate-500" aria-live="polite">${count} / ${this.maxLength}</div>`;
  }

  // ===========================================================================
  // MAIN RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    // VIEW MODE
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col w-full">
          ${this.renderLabel()}
          <div class="flex items-center min-h-[2.5rem] px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-900 text-sm">
            ${this.renderPrefix()}
            <span class="flex-1 select-text">
              ${this.inputType === 'password'
                ? this.msg.password
                : (this.value === '' ? this.msg.empty : this.value)}
            </span>
            ${this.renderSuffix()}
          </div>
        </div>
      `;
    }
    // EDIT MODE
    const hasError = !!this.error;
    const isDisabled = this.disabled || this.loading;
    const baseInputClasses = [
      'block w-full px-3 py-2 text-sm rounded-md border transition',
      isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'bg-white',
      this.readonly ? 'bg-slate-50' : '',
      hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-sky-500 focus:border-sky-500',
      this.isFocused ? 'ring-2 ring-sky-500 border-sky-500' : '',
      this.value ? 'text-slate-900' : 'text-slate-900',
    ].filter(Boolean).join(' ');
    const ariaLabelledBy = this.hasSlot('Label') ? 'label' : undefined;
    const ariaDescribedBy = hasError ? 'error' : (this.hasSlot('Helper') ? 'helper' : undefined);
    // Input/textarea row
    return html`
      <div class="flex flex-col w-full">
        ${this.renderLabel()}
        <div class="flex items-stretch w-full relative">
          ${this.renderPrefix()}
          ${this.rows > 1
            ? html`
                <textarea
                  class="${baseInputClasses} resize-none flex-1"
                  .value="${this.value}"
                  rows="${this.rows}"
                  name="${this.name}"
                  placeholder="${this.placeholder || this.msg.placeholder}"
                  maxlength="${this.maxLength !== null ? this.maxLength : undefined}"
                  minlength="${this.minLength !== null ? this.minLength : undefined}"
                  autocomplete="${this.autocomplete}"
                  ?disabled="${isDisabled}"
                  ?readonly="${this.readonly}"
                  aria-labelledby="${ariaLabelledBy}"
                  aria-describedby="${ariaDescribedBy}"
                  aria-invalid="${hasError ? 'true' : 'false'}"
                  aria-required="${this.required ? 'true' : 'false'}"
                  @input="${this.handleInput}"
                  @blur="${this.handleBlur}"
                  @focus="${this.handleFocus}"
                ></textarea>
              `
            : html`
                <input
                  class="${baseInputClasses} flex-1"
                  .value="${this.mask ? this.rawDisplay : this.value}"
                  type="${this.inputType}"
                  name="${this.name}"
                  placeholder="${this.placeholder || this.msg.placeholder}"
                  maxlength="${this.maxLength !== null ? this.maxLength : undefined}"
                  minlength="${this.minLength !== null ? this.minLength : undefined}"
                  autocomplete="${this.autocomplete}"
                  ?disabled="${isDisabled}"
                  ?readonly="${this.readonly}"
                  aria-labelledby="${ariaLabelledBy}"
                  aria-describedby="${ariaDescribedBy}"
                  aria-invalid="${hasError ? 'true' : 'false'}"
                  aria-required="${this.required ? 'true' : 'false'}"
                  @input="${this.handleInput}"
                  @blur="${this.handleBlur}"
                  @focus="${this.handleFocus}"
                />
              `
          }
          ${this.loading ? this.renderLoading() : nothing}
          ${this.renderSuffix()}
        </div>
        ${this.renderCharCounter()}
        ${this.renderHelperOrError()}
      </div>
    `;
  }
}
