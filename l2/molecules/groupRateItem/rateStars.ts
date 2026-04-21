/// <mls fileReference="_102020_/l2/molecules/groupRateItem/rateStars.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// RATE STARS MOLECULE
// =============================================================================
// Skill Group: groupRateItem (rate + item)
// Tag: molecules--group-rate-item--rate-stars-102020
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML, ifDefined } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  required: 'Required',
  error: 'Invalid rating',
  clear: 'Clear rating',
  noValue: '—',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    required: 'Obrigatório',
    error: 'Avaliação inválida',
    clear: 'Limpar avaliação',
    noValue: '—',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-rate-item--rate-stars-102020')
export class GroupRateItemRateStarsMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Item'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;
  @propertyDataSource({ type: String })
  error: string = '';
  @propertyDataSource({ type: String })
  name: string = '';
  @propertyDataSource({ type: Number })
  min: number = 1;
  @propertyDataSource({ type: Number })
  max: number = 5;
  @propertyDataSource({ type: Number })
  step: number = 1;
  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing: boolean = true;
  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;
  @propertyDataSource({ type: Boolean })
  readonly: boolean = false;
  @propertyDataSource({ type: Boolean })
  required: boolean = false;
  @property({ type: Boolean })
  loading: boolean = false;
  // ===========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private hoverValue: number | null = null;
  @state()
  private focusedIndex: number = -1; // For keyboard navigation
  // ===========================================================================
  // LIFECYCLE
  // ==========================================================================
  connectedCallback() {
    super.connectedCallback();
    // Reset focus state on attach
    this.focusedIndex = -1;
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleMouseEnter(value: number) {
    if (this.disabled || this.readonly || this.loading) return;
    this.hoverValue = value;
  }
  private handleMouseLeave() {
    if (this.disabled || this.readonly || this.loading) return;
    this.hoverValue = null;
  }
  private handleClick(value: number) {
    if (this.disabled || this.readonly || this.loading) return;
    if (this.value === value && !this.required) {
      // Allow clearing selection if not required
      this.value = null;
    } else {
      this.value = value;
    }
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }
  private handleFocus(index: number) {
    this.focusedIndex = index;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleBlur() {
    this.focusedIndex = -1;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    const items = this.getRatingItems();
    if (!items.length) return;
    let idx = this.focusedIndex;
    if (idx === -1) {
      // Focused index is not set, set to current value or first
      idx = items.findIndex(i => i.value === this.value);
      if (idx === -1) idx = 0;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      idx = Math.min(idx + 1, items.length - 1);
      this.focusedIndex = idx;
      (this.getStarButton(idx) as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      idx = Math.max(idx - 1, 0);
      this.focusedIndex = idx;
      (this.getStarButton(idx) as HTMLElement)?.focus();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const val = items[idx]?.value;
      if (val !== undefined) {
        this.handleClick(val);
      }
    } else if (e.key === 'Tab') {
      // Let tab propagate
      this.handleBlur();
    }
  }
  private getStarButton(idx: number): Element | null {
    return this.renderRoot?.querySelector?.(`[data-star-idx="${idx}"]`) || null;
  }
  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private getRatingItems(): { value: number; label: string }[] {
    // If <Item> slots exist, use them
    const slotItems = this.getSlots('Item');
    if (slotItems.length > 0) {
      return slotItems.map(el => ({
        value: Number(el.getAttribute('value')),
        label: el.innerHTML,
      })).filter(i => !isNaN(i.value));
    }
    // Else, auto-generate 5 stars (1-5)
    const items = [];
    for (let v = 1; v <= 5; v++) {
      items.push({ value: v, label: '' });
    }
    return items;
  }
  private isHighlighted(idx: number, value: number | null, hoverValue: number | null): boolean {
    // Highlight all up to hoverValue if hovering, else up to value
    if (hoverValue !== null) {
      return idx <= hoverValue - 1;
    }
    if (value !== null) {
      return idx <= value - 1;
    }
    return false;
  }
  private getAriaLabel(item: { value: number; label: string }, idx: number): string {
    // Prefer slot label, else fallback to number
    if (item.label) {
      // Remove HTML tags for aria-label
      const div = document.createElement('div');
      div.innerHTML = item.label;
      return div.textContent || `${item.value}`;
    }
    return `${item.value}`;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    if (this.loading) {
      return html`<div class="flex items-center gap-2 text-slate-400 animate-pulse select-none">${this.msg.loading}</div>`;
    }
    const items = this.getRatingItems();
    const hasLabel = this.hasSlot('Label');
    const hasHelper = this.hasSlot('Helper');
    const errorActive = !!this.error && this.isEditing;
    const ariaLabelledBy = hasLabel ? 'rate-label' : undefined;
    const ariaDescribedBy = errorActive ? 'rate-error' : (hasHelper ? 'rate-helper' : undefined);
    // =======================================================================
    // VIEW MODE (isEditing === false)
    // =======================================================================
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col gap-1">
          ${hasLabel ? html`<div id="rate-label" class="text-sm font-medium text-slate-700">${unsafeHTML(this.getSlotContent('Label'))}${this.required ? html`<span class="text-red-500 ml-1">*</span>` : nothing}</div>` : nothing}
          <div class="flex items-center gap-1">
            ${this.value === null
              ? html`<span class="text-slate-400">${this.msg.noValue}</span>`
              : items.map((item, idx) => {
                  const filled = idx <= (this.value! - 1);
                  return html`<svg aria-hidden="true" class="w-6 h-6 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 fill-slate-200'}" viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9.5 17,15 18.5,22 12,18.5 5.5,22 7,15 2,9.5 9,9"/></svg>`;
                })}
          </div>
        </div>
      `;
    }
    // =======================================================================
    // EDIT MODE (isEditing === true)
    // =======================================================================
    return html`
      <div
        class="flex flex-col gap-1"
        role="radiogroup"
        aria-labelledby=${ifDefined(ariaLabelledBy)}
        aria-describedby=${ifDefined(ariaDescribedBy)}
        aria-invalid=${errorActive ? 'true' : 'false'}
        aria-required=${this.required ? 'true' : 'false'}
      >
        ${hasLabel ? html`<div id="rate-label" class="text-sm font-medium text-slate-700">${unsafeHTML(this.getSlotContent('Label'))}${this.required ? html`<span class="text-red-500 ml-1">*</span>` : nothing}</div>` : nothing}
        <div class="flex items-center gap-1 select-none">
          ${items.map((item, idx) => {
            const highlighted = this.isHighlighted(idx, this.value, this.hoverValue);
            const selected = this.value === item.value;
            const ariaChecked = selected ? 'true' : 'false';
            const ariaLabel = this.getAriaLabel(item, idx);
            const tabIndex = this.disabled || this.readonly || this.loading ? -1 : (selected ? 0 : -1);
            return html`
              <button
                type="button"
                data-star-idx="${idx}"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 transition
                  ${highlighted ? 'bg-yellow-50' : ''}
                  ${selected ? 'ring-2 ring-yellow-400' : ''}
                  ${this.disabled || this.readonly || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-yellow-100'}
                  ${errorActive ? 'border-red-400' : ''}
                "
                role="radio"
                aria-checked="${ariaChecked}"
                aria-label="${ariaLabel}"
                aria-disabled="${this.disabled || this.readonly || this.loading ? 'true' : 'false'}"
                ?disabled=${this.disabled || this.readonly || this.loading}
                tabindex="${tabIndex}"
                @mouseenter=${() => this.handleMouseEnter(item.value)}
                @mouseleave=${() => this.handleMouseLeave()}
                @focus=${() => this.handleFocus(idx)}
                @blur=${() => this.handleBlur()}
                @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
                @click=${() => this.handleClick(item.value)}
              >
                ${item.label
                  ? html`<span class="text-lg">${unsafeHTML(item.label)}</span>`
                  : html`<svg aria-hidden="true" class="w-6 h-6 ${highlighted ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 fill-slate-200'}" viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9.5 17,15 18.5,22 12,18.5 5.5,22 7,15 2,9.5 9,9"/></svg>`}
              </button>
            `;
          })}
          ${!this.required && this.value !== null && !this.disabled && !this.readonly && !this.loading ? html`
            <button
              type="button"
              class="ml-2 px-2 py-1 rounded text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              @click=${() => this.handleClick(this.value!)}
              aria-label="${this.msg.clear}"
              tabindex="0"
            >
              <svg class="inline w-4 h-4 align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          ` : nothing}
        </div>
        ${errorActive ? html`<div id="rate-error" class="text-xs text-red-600 mt-1">${this.error}</div>`
          : hasHelper ? html`<div id="rate-helper" class="text-xs text-slate-500 mt-1">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
          : nothing}
      </div>
    `
      ;
  }
}
