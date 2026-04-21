/// <mls fileReference="_102020_/l2/molecules/groupRateItem/npsScale.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// NPS SCALE MOLECULE
// =============================================================================
// Skill Group: groupRateItem (rate + item)
// Tag: molecules--group-rate-item--nps-scale-102020
// Allows user to select a single rating from 0 to 10 (NPS scale)
import {
  html,
  TemplateResult,
  nothing,
  unsafeHTML,
  ifDefined
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  propertyDataSource
} from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  select: 'Select a score',
  noValue: '—',
  error: 'This field is required',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    select: 'Selecione uma nota',
    noValue: '—',
    error: 'Este campo é obrigatório',
  },
};
/// **collab_i18n_end**
@customElement('molecules--group-rate-item--nps-scale-102020')
export class GroupRateItemNpsScaleMolecule extends MoleculeAuraElement {
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
  min: number = 0;
  @propertyDataSource({ type: Number })
  max: number = 10;
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
    this.addEventListener('keydown', this.handleKeyDown as EventListener);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown as EventListener);
  }
  // ===========================================================================
  // ITEM PARSING
  // ==========================================================================
  private getItems(): { value: number; label: string }[] {
    const slotItems = this.getSlots('Item');
    if (slotItems.length > 0) {
      // Use slot items
      return slotItems.map(el => ({
        value: Number(el.getAttribute('value')),
        label: el.innerHTML,
      })).filter(item => !isNaN(item.value));
    }
    // Auto-generate 0-10
    const items = [];
    for (let v = this.min; v <= this.max; v += this.step) {
      items.push({ value: v, label: String(v) });
    }
    return items;
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleMouseEnter(value: number) {
    if (this.disabled || this.readonly || !this.isEditing) return;
    this.hoverValue = value;
  }
  private handleMouseLeave() {
    if (this.disabled || this.readonly || !this.isEditing) return;
    this.hoverValue = null;
  }
  private handleClick(value: number) {
    if (this.disabled || this.readonly || !this.isEditing) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value },
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
  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isEditing || this.disabled || this.readonly) return;
    const items = this.getItems();
    if (!items.length) return;
    let idx = this.focusedIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      idx = idx < items.length - 1 ? idx + 1 : 0;
      this.focusOption(idx);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      idx = idx > 0 ? idx - 1 : items.length - 1;
      this.focusOption(idx);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (idx >= 0 && idx < items.length) {
        this.handleClick(items[idx].value);
      }
    }
  };
  private focusOption(idx: number) {
    this.focusedIndex = idx;
    const items = this.getItems();
    const el = this.renderRoot?.querySelector(
      `[data-nps-idx="${idx}"]`
    ) as HTMLElement | null;
    if (el) el.focus();
  }
  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private getAriaLabel(item: { value: number; label: string }): string {
    // Prefer slot label if present, else number
    if (item.label && item.label !== String(item.value)) {
      // Remove HTML tags for aria-label
      return item.label.replace(/<[^>]*>?/gm, '').trim() || String(item.value);
    }
    return String(item.value);
  }
  private isHighlighted(itemValue: number): boolean {
    // For NPS, only the hovered or selected value is highlighted
    if (this.hoverValue !== null) {
      return itemValue === this.hoverValue;
    }
    return itemValue === this.value;
  }
  private isSelected(itemValue: number): boolean {
    return itemValue === this.value;
  }
  private getLabelId(): string {
    return `${this.name || 'nps'}-label`;
  }
  private getErrorId(): string {
    return `${this.name || 'nps'}-error`;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const items = this.getItems();
    const hasLabel = this.hasSlot('Label');
    const hasHelper = this.hasSlot('Helper');
    const hasError = !!this.error && this.isEditing;
    const ariaLabelledBy = hasLabel ? this.getLabelId() : undefined;
    const ariaDescribedBy = hasError ? this.getErrorId() : undefined;
    // =============================
    // VIEW MODE
    // =============================
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col gap-1">
          ${hasLabel
            ? html`<div id="${this.getLabelId()}" class="text-sm font-medium text-slate-700 mb-1">
                ${unsafeHTML(this.getSlotContent('Label'))}
              </div>`
            : nothing}
          <div class="flex items-center gap-2 min-h-[2.5rem]">
            ${this.value === null
              ? html`<span class="text-slate-400">${this.msg.noValue}</span>`
              : items.map(item =>
                  this.isSelected(item.value)
                    ? html`<span class="inline-block rounded bg-sky-100 text-sky-700 font-bold px-2 py-1 border border-sky-300">
                        ${item.label ? unsafeHTML(item.label) : item.value}
                      </span>`
                    : nothing
                )
            }
          </div>
        </div>
      `;
    }
    // =============================
    // EDIT MODE
    // =============================
    return html`
      <div
        class="flex flex-col gap-1"
        role="radiogroup"
        aria-labelledby="${ifDefined(ariaLabelledBy)}"
        aria-describedby="${ifDefined(ariaDescribedBy)}"
        aria-invalid="${hasError ? 'true' : 'false'}"
        aria-required="${this.required ? 'true' : 'false'}"
      >
        ${hasLabel
          ? html`<div id="${this.getLabelId()}" class="text-sm font-medium text-slate-700 mb-1">
              ${unsafeHTML(this.getSlotContent('Label'))}
            </div>`
          : nothing}
        <div class="flex items-center gap-1 overflow-x-auto">
          ${items.map((item, idx) => {
            const highlighted = this.isHighlighted(item.value);
            const selected = this.isSelected(item.value);
            const base = [
              'nps-btn',
              'relative flex flex-col items-center justify-center',
              'min-w-[2.25rem] min-h-[2.25rem]',
              'rounded-full border border-slate-300',
              'transition',
              'outline-none',
              'focus:ring-2 focus:ring-sky-500',
              'text-base font-medium',
              'select-none',
              'cursor-pointer',
              this.disabled || this.readonly ? 'opacity-50 cursor-not-allowed' : '',
              highlighted ? 'bg-sky-100 border-sky-400 text-sky-700' : '',
              selected ? 'bg-sky-500 border-sky-700 text-white' : '',
              hasError ? 'border-red-500' : '',
            ].filter(Boolean).join(' ');
            return html`
              <button
                type="button"
                class="${base}"
                data-nps-idx="${idx}"
                role="radio"
                aria-checked="${selected ? 'true' : 'false'}"
                aria-label="${this.getAriaLabel(item)}"
                tabindex="${this.focusedIndex === idx || (this.focusedIndex === -1 && selected) ? '0' : '-1'}"
                ?disabled="${this.disabled}"
                @mouseenter="${() => this.handleMouseEnter(item.value)}"
                @mouseleave="${() => this.handleMouseLeave()}"
                @focus="${() => this.handleFocus(idx)}"
                @blur="${() => this.handleBlur()}"
                @click="${() => this.handleClick(item.value)}"
              >
                ${item.label ? unsafeHTML(item.label) : item.value}
              </button>
            `;
          })}
        </div>
        ${hasError
          ? html`<div id="${this.getErrorId()}" class="text-xs text-red-600 mt-1">${this.error}</div>`
          : hasHelper
            ? html`<div class="text-xs text-slate-500 mt-1">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
            : nothing}
      </div>
    `;
  }
}
