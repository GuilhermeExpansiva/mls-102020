/// <mls fileReference="_102020_/l2/molecules/groupEnterNumber/inputStepper.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// INPUT STEPPER MOLECULE (enter + number)
// =============================================================================
// Tag: molecules--group-enter-number--input-stepper-102020
// Skill Group: groupEnterNumber (enter + number)
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML, ifDefined } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
    placeholder: 'Enter a number',
    loading: 'Loading...',
    empty: '—',
    decrement: 'Decrement',
    increment: 'Increment',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
    en: message_en,
    pt: {
        placeholder: 'Digite um número',
        loading: 'Carregando...',
        empty: '—',
        decrement: 'Diminuir',
        increment: 'Aumentar',
    },
};
/// **collab_i18n_end**
@customElement('molecules--group-enter-number--input-stepper-102020')
export class GroupEnterNumberInputStepperMolecule extends MoleculeAuraElement {
    private msg: MessageType = messages.en;
    // ===========================================================================
    // SLOT TAGS
    // ==========================================================================
    slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];
    // ===========================================================================
    // PROPERTIES — Contract
    // ==========================================================================
    @propertyDataSource({ type: Number })
    value: number | null = null;
    @propertyDataSource({ type: String })
    error: string = '';
    @propertyDataSource({ type: String })
    name: string = '';
    @propertyDataSource({ type: Number })
    min: number | null = null;
    @propertyDataSource({ type: Number })
    max: number | null = null;
    @propertyDataSource({ type: Number })
    step: number = 1;
    @propertyDataSource({ type: Number })
    decimals: number = 0;
    @propertyDataSource({ type: String })
    locale: string = '';
    @propertyDataSource({ type: String })
    placeholder: string = '';
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
    private rawValue: string = '';
    // ===========================================================================
    // STATE CHANGE HANDLER (for derived value)
    // ==========================================================================
    handleIcaStateChange(key: string, value: any) {
        // Update rawValue when value changes externally
        const valueAttr = this.getAttribute('value');
        if (valueAttr === `{{${key}}}`) {
            this.rawValue = this.formatToDisplay(value);
        }
        this.requestUpdate();
    }
    // ===========================================================================
    // FORMAT/UTILS
    // ==========================================================================
    private formatToDisplay(val: number | null): string {
        if (val === null || val === undefined || isNaN(val)) return '';
        const decimals = typeof this.decimals === 'number' ? this.decimals : 0;
        const locale = this.locale || undefined;
        try {
            return val.toLocaleString(locale, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
        } catch {
            return val.toString();
        }
    }
    private parseRawToNumber(raw: string): number | null {
        if (!raw) return null;
        let cleaned = raw.replace(/\s/g, '');
        // Handle locale decimal separator
        if (this.locale === 'pt-BR') {
            cleaned = cleaned.replace(/\./g, '').replace(/,/g, '.');
        } else if (this.locale === 'en-US') {
            cleaned = cleaned.replace(/,/g, '');
        }
        const num = parseFloat(cleaned);
        if (isNaN(num)) return null;
        return this.roundToDecimals(num);
    }
    private roundToDecimals(val: number): number {
        const decimals = typeof this.decimals === 'number' ? this.decimals : 0;
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }
    private clamp(val: number | null): number | null {
        if (val === null || val === undefined || isNaN(val)) return null;
        if (this.min !== null && val < this.min) return this.min;
        if (this.max !== null && val > this.max) return this.max;
        return val;
    }
    // ===========================================================================
    // EVENT EMITTERS
    // ==========================================================================
    private emitChange() {
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }
    private emitInput() {
        this.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }
    private emitBlur() {
        this.dispatchEvent(new CustomEvent('blur', {
            bubbles: true,
            composed: true,
        }));
    }
    private emitFocus() {
        this.dispatchEvent(new CustomEvent('focus', {
            bubbles: true,
            composed: true,
        }));
    }
    // ===========================================================================
    // STEPPER HANDLERS
    // ==========================================================================
    private increment() {
        if (this.disabled || this.readonly || this.loading) return;
        const current = this.value ?? 0;
        let next = current + this.step;
        if (this.max !== null && next > this.max) next = this.max;
        this.value = this.roundToDecimals(next);
        this.rawValue = this.formatToDisplay(this.value);
        this.emitChange();
    }
    private decrement() {
        if (this.disabled || this.readonly || this.loading) return;
        const current = this.value ?? 0;
        let next = current - this.step;
        if (this.min !== null && next < this.min) next = this.min;
        this.value = this.roundToDecimals(next);
        this.rawValue = this.formatToDisplay(this.value);
        this.emitChange();
    }
    // ===========================================================================
    // INPUT HANDLERS
    // ==========================================================================
    private handleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.rawValue = input.value;
        const parsed = this.parseRawToNumber(input.value);
        this.value = parsed;
        this.emitInput();
    }
    private handleBlur() {
        // Clamp and normalize
        let parsed = this.parseRawToNumber(this.rawValue);
        parsed = this.clamp(parsed);
        if (parsed !== null && typeof parsed === 'number') {
            parsed = this.roundToDecimals(parsed);
        }
        this.value = parsed;
        this.rawValue = this.formatToDisplay(parsed);
        this.emitChange();
        this.emitBlur();
    }
    private handleFocus() {
        this.emitFocus();
    }
    // ===========================================================================
    // RENDER
    // ==========================================================================
    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        // Loading state
        if (this.loading) {
            return html`<div class="flex items-center gap-2 text-slate-400"><span class="animate-spin h-4 w-4 border-2 border-t-sky-500 border-slate-200 rounded-full"></span>${this.msg.loading}</div>`;
        }
        // View Mode
        if (!this.isEditing) {
            return this.renderViewMode();
        }
        // Edit Mode
        return this.renderEditMode();
    }
    private renderViewMode(): TemplateResult {
        const label = this.hasSlot('Label') ? html`<div class="mb-1 text-sm font-medium text-slate-700" id="label">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing;
        const prefix = this.hasSlot('Prefix') ? html`<span class="mr-1">${unsafeHTML(this.getSlotContent('Prefix'))}</span>` : nothing;
        const suffix = this.hasSlot('Suffix') ? html`<span class="ml-1">${unsafeHTML(this.getSlotContent('Suffix'))}</span>` : nothing;
        const display = (this.value === null || this.value === undefined || isNaN(this.value))
            ? this.msg.empty
            : this.formatToDisplay(this.value);
        return html`
      <div class="flex flex-col w-full">
        ${label}
        <div class="flex items-center text-base text-slate-900 min-h-[2.5rem]">
          ${prefix}
          <span>${display}</span>
          ${suffix}
        </div>
      </div>
    `;
    }
    private renderEditMode(): TemplateResult {
        const label = this.hasSlot('Label') ? html`<div class="mb-1 text-sm font-medium text-slate-700" id="label">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing;
        const prefix = this.hasSlot('Prefix') ? html`<span class="mr-1">${unsafeHTML(this.getSlotContent('Prefix'))}</span>` : nothing;
        const suffix = this.hasSlot('Suffix') ? html`<span class="ml-1">${unsafeHTML(this.getSlotContent('Suffix'))}</span>` : nothing;
        const error = this.error && this.error !== '';
        const inputId = this.name ? `input-${this.name}` : 'input-number';
        const describedBy = error ? 'error' : (this.hasSlot('Helper') ? 'helper' : undefined);
        const placeholder = this.placeholder || this.msg.placeholder;
        // Visual state classes
        const inputClasses = [
            'block w-full px-3 py-2 text-base rounded-md border transition',
            error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500',
            this.disabled ? 'bg-slate-100 opacity-60 cursor-not-allowed' : 'bg-white',
            this.readonly ? 'bg-slate-50 cursor-default' : '',
        ].join(' ');
        return html`
      <div class="flex flex-col w-full">
        ${label}
        <div class="flex items-center gap-1">
          <!-- Stepper Decrement -->
          <button
            type="button"
            class="h-9 w-9 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="${this.msg.decrement}"
            ?disabled=${this.disabled || this.readonly}
            @click=${this.decrement}
            tabindex="-1"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="7.25" width="10" height="1.5" rx="0.75" fill="currentColor"/></svg>
          </button>
          <!-- Prefix -->
          ${prefix}
          <!-- Input -->
          <input
            id="${inputId}"
            class="${inputClasses}"
            type="text"
            inputmode="decimal"
            .value=${this.rawValue}
            ?disabled=${this.disabled || this.loading}
            ?readonly=${this.readonly}
            aria-labelledby="label"
            aria-describedby="${ifDefined(describedBy)}"
            aria-invalid="${error ? 'true' : 'false'}"
            aria-required="${this.required ? 'true' : 'false'}"
            placeholder="${placeholder}"
            @input=${this.handleInput}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            name="${this.name}"
            autocomplete="off"
            spellcheck="false"
          />
          <!-- Suffix -->
          ${suffix}
          <!-- Stepper Increment -->
          <button
            type="button"
            class="h-9 w-9 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="${this.msg.increment}"
            ?disabled=${this.disabled || this.readonly}
            @click=${this.increment}
            tabindex="-1"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="7.25" width="10" height="1.5" rx="0.75" fill="currentColor"/><rect x="7.25" y="3" width="1.5" height="10" rx="0.75" fill="currentColor"/></svg>
          </button>
        </div>
        <!-- Error or Helper -->
        ${error
                ? html`<div id="error" class="mt-1 text-sm text-red-600">${this.error}</div>`
                : (this.hasSlot('Helper')
                    ? html`<div id="helper" class="mt-1 text-sm text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
                    : nothing
                )
            }
      </div>
    `;
    }
}
