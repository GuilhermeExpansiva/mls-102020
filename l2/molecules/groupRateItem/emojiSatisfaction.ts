/// <mls fileReference="_102020_/l2/molecules/groupRateItem/emojiSatisfaction.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// EMOJI SATISFACTION RATE ITEM MOLECULE
// =============================================================================
// Skill Group: groupRateItem (rate + item)
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML, ifDefined } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select your satisfaction',
  noValue: '—',
  error: 'This field is required',
  loading: 'Loading...',
};
const message_pt = {
  placeholder: 'Selecione seu nível de satisfação',
  noValue: '—',
  error: 'Este campo é obrigatório',
  loading: 'Carregando...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: message_pt,
};
/// **collab_i18n_end**

@customElement('molecules--group-rate-item--emoji-satisfaction-102020')
export class GroupRateItemEmojiSatisfactionMolecule extends MoleculeAuraElement {
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
  private focusIndex: number = -1;

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
  // SLOT/ITEMS
  // ==========================================================================
  private getItems(): { value: number; label: string; ariaLabel: string }[] {
    const slotItems = this.getSlots('Item');
    if (slotItems.length > 0) {
      return slotItems.map((el, idx) => {
        const valueAttr = el.getAttribute('value');
        const value = valueAttr !== null ? Number(valueAttr) : this.min + idx * this.step;
        const label = el.innerHTML;
        const ariaLabel = el.getAttribute('aria-label') || label.replace(/<[^>]+>/g, '') || `${value}`;
        return { value, label, ariaLabel };
      });
    }
    // Default: 5 emojis (😡, 😕, 😐, 🙂, 😍)
    const defaultEmojis = [
      { emoji: '😡', aria: 'Very dissatisfied' },
      { emoji: '😕', aria: 'Dissatisfied' },
      { emoji: '😐', aria: 'Neutral' },
      { emoji: '🙂', aria: 'Satisfied' },
      { emoji: '😍', aria: 'Very satisfied' },
    ];
    const items: { value: number; label: string; ariaLabel: string }[] = [];
    let idx = 0;
    for (let v = this.min; v <= this.max; v += this.step) {
      const emojiObj = defaultEmojis[idx] || defaultEmojis[defaultEmojis.length - 1];
      items.push({ value: v, label: emojiObj.emoji, ariaLabel: emojiObj.aria });
      idx++;
    }
    return items;
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
    this.value = value;
    this.hoverValue = null;
    this.focusIndex = this.getItems().findIndex(i => i.value === value);
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
  }
  private handleBlur(e?: FocusEvent) {
    this.focusIndex = -1;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleFocus(idx: number) {
    this.focusIndex = idx;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    const items = this.getItems();
    if (!items.length) return;
    const currentIdx = this.focusIndex >= 0 ? this.focusIndex : items.findIndex(i => i.value === this.value);
    let nextIdx = currentIdx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = Math.min(items.length - 1, currentIdx + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = Math.max(0, currentIdx - 1);
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIdx = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIdx = items.length - 1;
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (currentIdx >= 0 && currentIdx < items.length) {
        this.handleClick(items[currentIdx].value);
      }
      e.preventDefault();
      return;
    } else {
      return;
    }
    if (nextIdx !== currentIdx) {
      this.focusIndex = nextIdx;
      const itemEls = this.getOptionElements();
      if (itemEls[nextIdx]) {
        (itemEls[nextIdx] as HTMLElement).focus();
      }
    }
  };
  private getOptionElements(): NodeListOf<HTMLElement> {
    return this.renderRoot.querySelectorAll('.emoji-rate-item');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private getAriaLabelledById(): string | undefined {
    return this.hasSlot('Label') ? `${this.localName}-label` : undefined;
  }
  private getAriaDescribedById(): string | undefined {
    if (this.error && this.isEditing) return `${this.localName}-error`;
    if (this.hasSlot('Helper') && this.isEditing) return `${this.localName}-helper`;
    return undefined;
  }
  private isOptionHighlighted(itemValue: number, idx: number): boolean {
    if (this.hoverValue !== null) {
      // Highlight only hovered option (discrete)
      return this.hoverValue === itemValue;
    }
    return this.value === itemValue;
  }
  private getOptionTabIndex(idx: number): number {
    if (this.disabled || this.readonly || this.loading) return -1;
    if (this.focusIndex === idx) return 0;
    if (this.value !== null) {
      const items = this.getItems();
      const selectedIdx = items.findIndex(i => i.value === this.value);
      return selectedIdx === idx ? 0 : -1;
    }
    return idx === 0 ? 0 : -1;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    if (this.loading) {
      return html`<div class="flex items-center gap-2 text-slate-400 animate-pulse select-none">
        <span class="i-tabler-loader-2 animate-spin"></span>
        <span>${this.msg.loading}</span>
      </div>`;
    }
    const items = this.getItems();
    const ariaLabelledBy = this.getAriaLabelledById();
    const ariaDescribedBy = this.getAriaDescribedById();
    // ===================== VIEW MODE =====================
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col gap-1">
          ${this.hasSlot('Label') ? html`<div id="${this.localName}-label" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
          <div class="flex items-center gap-2 min-h-[40px]">
            ${this.value === null
              ? html`<span class="text-slate-400">${this.msg.noValue}</span>`
              : this.renderViewValue(items)}
          </div>
        </div>
      `;
    }
    // ===================== EDIT MODE =====================
    const hasError = !!this.error && this.error !== '';
    return html`
      <div
        class="flex flex-col gap-1"
        role="radiogroup"
        aria-labelledby="${ifDefined(ariaLabelledBy)}"
        aria-describedby="${ifDefined(ariaDescribedBy)}"
        aria-invalid="${hasError ? 'true' : 'false'}"
        aria-required="${this.required ? 'true' : 'false'}"
      >
        ${this.hasSlot('Label') ? html`<div id="${this.localName}-label" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}${this.required ? html`<span class="text-red-500">*</span>` : nothing}</div>` : nothing}
        <div class="flex items-center gap-2">
          ${items.map((item, idx) => {
            const highlighted = this.isOptionHighlighted(item.value, idx);
            const selected = this.value === item.value;
            const tabIndex = this.getOptionTabIndex(idx);
            return html`
              <button
                type="button"
                class="emoji-rate-item flex flex-col items-center justify-center w-12 h-12 rounded-full border transition
                  ${highlighted ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white'}
                  ${selected ? 'ring-2 ring-sky-500' : ''}
                  ${this.disabled || this.readonly ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'}
                  ${hasError ? 'border-red-500' : ''}
                  "
                role="radio"
                aria-checked="${selected ? 'true' : 'false'}"
                aria-label="${item.ariaLabel}"
                aria-disabled="${this.disabled || this.readonly || this.loading ? 'true' : 'false'}"
                tabindex="${tabIndex}"
                ?disabled="${this.disabled || this.loading}"
                @mouseenter="${() => this.handleMouseEnter(item.value)}"
                @mouseleave="${this.handleMouseLeave}"
                @focus="${() => this.handleFocus(idx)}"
                @blur="${this.handleBlur}"
                @click="${() => this.handleClick(item.value)}"
              >
                <span class="text-2xl select-none pointer-events-none">${unsafeHTML(item.label)}</span>
              </button>
            `;
          })}
        </div>
        <div class="min-h-[20px] mt-1">
          ${hasError
            ? html`<div id="${this.localName}-error" class="text-xs text-red-600 mt-1">${this.error}</div>`
            : this.hasSlot('Helper')
              ? html`<div id="${this.localName}-helper" class="text-xs text-slate-500 mt-1">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
              : nothing}
        </div>
      </div>
    `;
  }

  private renderViewValue(items: { value: number; label: string; ariaLabel: string }[]): TemplateResult {
    const selected = items.find(i => i.value === this.value);
    if (!selected) {
      return html`<span class="text-slate-400">${this.msg.noValue}</span>`;
    }
    return html`<span class="text-2xl">${unsafeHTML(selected.label)}</span>`;
  }
}
