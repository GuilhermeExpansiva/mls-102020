/// <mls fileReference="_102020_/l2/molecules/groupRateItem/rateHearts.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// RATE HEARTS MOLECULE
// =============================================================================
// Skill Group: groupRateItem (rate + item)
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML, ifDefined } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select a rating',
  noValue: '—',
  errorRequired: 'Please select a rating',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma nota',
    noValue: '—',
    errorRequired: 'Selecione uma nota',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-rate-item--rate-hearts-102020')
export class GroupRateItemRateHeartsMolecule extends MoleculeAuraElement {
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

  // ===========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private hoverValue: number | null = null;

  @state()
  private focusedIndex: number | null = null;

  // ===========================================================================
  // STATE CHANGE HANDLER (for derived values)
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    // No derived values needed for this molecule
    this.requestUpdate();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleOptionMouseEnter(val: number) {
    if (this.disabled || this.readonly || !this.isEditing) return;
    this.hoverValue = val;
  }

  private handleOptionMouseLeave() {
    if (this.disabled || this.readonly || !this.isEditing) return;
    this.hoverValue = null;
  }

  private handleOptionClick(val: number) {
    if (this.disabled || this.readonly || !this.isEditing) return;
    if (this.value === val && !this.required) {
      // Allow clearing selection if not required
      this.value = null;
    } else {
      this.value = val;
    }
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleBlur() {
    this.focusedIndex = null;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleFocus(idx: number) {
    this.focusedIndex = idx;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleKeyDown(e: KeyboardEvent, items: ParsedItem[]) {
    if (!this.isEditing || this.disabled || this.readonly) return;
    const currentIdx = this.focusedIndex ?? (this.value !== null ? items.findIndex(i => i.value === this.value) : -1);
    let nextIdx = currentIdx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nextIdx = Math.min(items.length - 1, (currentIdx === -1 ? 0 : currentIdx + 1));
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nextIdx = Math.max(0, (currentIdx === -1 ? 0 : currentIdx - 1));
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIdx = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIdx = items.length - 1;
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (currentIdx >= 0 && currentIdx < items.length) {
        this.handleOptionClick(items[currentIdx].value);
      }
      e.preventDefault();
      return;
    }
    if (nextIdx !== currentIdx && nextIdx >= 0 && nextIdx < items.length) {
      this.focusedIndex = nextIdx;
      const el = this.renderRoot?.querySelector(`#rate-heart-opt-${nextIdx}`) as HTMLElement;
      el?.focus();
    }
  }

  // ===========================================================================
  // ITEM PARSING
  // ==========================================================================
  private getParsedItems(): ParsedItem[] {
    // If <Item> slots exist, use them
    const slotEls = this.getSlots('Item');
    if (slotEls.length > 0) {
      return slotEls.map((el, idx) => ({
        value: Number(el.getAttribute('value')),
        label: el.innerHTML,
        idx,
      })).filter(i => !isNaN(i.value));
    }
    // Else, auto-generate
    const items: ParsedItem[] = [];
    for (let v = this.min; v <= this.max; v += this.step) {
      items.push({ value: v, label: '', idx: items.length });
    }
    return items;
  }

  // ===========================================================================
  // VISUAL HELPERS
  // ==========================================================================
  private getHeartIcon(filled: boolean, error: boolean, highlight: boolean): string {
    // SVG heart, colored
    if (filled) {
      if (error) {
        return `<svg aria-hidden="true" class="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      }
      return `<svg aria-hidden="true" class="w-7 h-7 text-pink-500 ${highlight ? 'scale-110' : ''}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }
    // Outline heart
    return `<svg aria-hidden="true" class="w-7 h-7 text-slate-300 ${highlight ? 'scale-110' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>`;
  }

  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    if (this.disabled && this.isEditing) {
      // If loading/disabled, show as view mode
      return this.renderViewMode();
    }
    if (!this.isEditing) {
      return this.renderViewMode();
    }
    return this.renderEditMode();
  }

  private renderViewMode(): TemplateResult {
    const items = this.getParsedItems();
    const labelId = this.hasSlot('Label') ? 'rate-hearts-label' : undefined;
    return html`
      <div class="flex flex-col gap-1">
        ${this.hasSlot('Label') ? html`<div id="${labelId}" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
        <div class="flex items-center gap-1">
          ${this.value === null
            ? html`<span class="text-slate-400 text-lg">${this.msg.noValue}</span>`
            : items.map((item, idx) => {
                const filled = this.value !== null && item.value <= this.value;
                return html`<span class="inline-block align-middle">${unsafeHTML(this.getHeartIcon(filled, false, false))}</span>`;
              })}
        </div>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const items = this.getParsedItems();
    const labelId = this.hasSlot('Label') ? 'rate-hearts-label' : undefined;
    const errorId = this.error ? 'rate-hearts-error' : undefined;
    const ariaDescribedBy = [errorId, this.hasSlot('Helper') && !this.error ? 'rate-hearts-helper' : undefined].filter(Boolean).join(' ') || undefined;
    const ariaLabelledBy = labelId || undefined;
    const hasError = !!this.error;
    return html`
      <div
        class="flex flex-col gap-1"
        role="radiogroup"
        aria-labelledby="${ifDefined(ariaLabelledBy)}"
        aria-describedby="${ifDefined(ariaDescribedBy)}"
        aria-invalid="${hasError ? 'true' : 'false'}"
        aria-required="${this.required ? 'true' : 'false'}"
      >
        ${this.hasSlot('Label') ? html`<div id="${labelId}" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}${this.required ? html`<span class="text-pink-500">*</span>` : nothing}</div>` : nothing}
        <div class="flex items-center gap-1 select-none">
          ${items.map((item, idx) => {
            const isHovered = this.hoverValue !== null ? item.value <= this.hoverValue! : false;
            const isSelected = this.value !== null ? item.value <= this.value! : false;
            const highlight = this.hoverValue !== null ? isHovered : isSelected;
            const filled = highlight;
            const error = hasError;
            const customLabel = item.label?.trim();
            const showCustom = !!customLabel;
            const tabIndex = this.disabled || this.readonly ? -1 : (this.focusedIndex === idx || (this.focusedIndex === null && this.value !== null && this.value === item.value) ? 0 : -1);
            return html`
              <button
                id="rate-heart-opt-${idx}"
                type="button"
                class="group p-0 m-0 bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded transition-transform ${this.disabled || this.readonly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${hasError ? 'ring-2 ring-red-400' : ''}"
                role="radio"
                aria-checked="${this.value === item.value ? 'true' : 'false'}"
                aria-label="${showCustom ? '' : `Rating ${item.value}` }"
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                tabindex="${tabIndex}"
                @mouseenter=${() => this.handleOptionMouseEnter(item.value)}
                @mouseleave=${() => this.handleOptionMouseLeave()}
                @focus=${() => this.handleFocus(idx)}
                @blur=${() => this.handleBlur()}
                @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, items)}
                @click=${() => this.handleOptionClick(item.value)}
              >
                ${showCustom
                  ? html`<span class="inline-block align-middle">${unsafeHTML(item.label)}</span>`
                  : html`<span class="inline-block align-middle">${unsafeHTML(this.getHeartIcon(filled, error, highlight))}</span>`}
              </button>
            `;
          })}
        </div>
        ${hasError
          ? html`<div id="${errorId}" class="text-xs text-red-600 mt-1">${this.error}</div>`
          : this.hasSlot('Helper')
            ? html`<div id="rate-hearts-helper" class="text-xs text-slate-500 mt-1">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
            : nothing}
      </div>
    `;
  }
}

// ===========================================================================
// TYPES
// ===========================================================================
type ParsedItem = {
  value: number;
  label: string;
  idx: number;
};
