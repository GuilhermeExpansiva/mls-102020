/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/segmentedControl.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SEGMENTED CONTROL MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  noResults: 'No options available',
  loading: 'Loading...',
  required: 'Required',
};
const message_pt = {
  placeholder: 'Selecione uma opção',
  noResults: 'Nenhuma opção disponível',
  loading: 'Carregando...',
  required: 'Obrigatório',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: message_pt,
};
/// **collab_i18n_end**

@customElement('molecules--group-select-one--segmented-control-102020')
export class GroupSelectOneSegmentedControlMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;
  @propertyDataSource({ type: String })
  error: string = '';
  @propertyDataSource({ type: String })
  name: string = '';
  @propertyDataSource({ type: String })
  placeholder: string = '';
  @propertyDataSource({ type: Boolean })
  searchable: boolean = false; // Not used in segmented control
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
  private searchQuery: string = '';
  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleSelect(value: string) {
    if (this.disabled || this.readonly || this.loading) return;
    if (this.value === value) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
  }
  private handleBlur() {
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleFocus() {
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    // Read all items (standalone, not inside groups)
    const items = this.getSlots('Item').map(el => ({
      value: el.getAttribute('value') || '',
      label: el.innerHTML,
      disabled: el.hasAttribute('disabled'),
    }));
    // Read groups (not used in segmented control, but contract requires)
    const groups = this.getSlots('Group').map(group => ({
      label: group.getAttribute('label') || '',
      items: Array.from(group.querySelectorAll('Item')).map(el => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML,
        disabled: el.hasAttribute('disabled'),
      })),
    }));
    // Merge all items (groups + standalone)
    let allItems = [
      ...groups.flatMap(g => g.items),
      ...items,
    ];
    // Remove duplicates by value
    const seen = new Set<string>();
    allItems = allItems.filter(i => {
      if (seen.has(i.value)) return false;
      seen.add(i.value);
      return true;
    });
    // Only allow 2-5 options
    if (allItems.length < 2 || allItems.length > 5) {
      return html`<div class="text-red-600 text-sm font-medium p-2 border border-red-200 bg-red-50 rounded">Segmented control requires 2 to 5 options.</div>`;
    }
    // Find selected item
    const selectedItem = allItems.find(i => i.value === this.value) || null;
    // View Mode (isEditing === false)
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col gap-1">
          ${this.hasSlot('Label') ? html`<div class="text-sm font-medium text-slate-700" id="label">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
          <div class="min-h-[2.5rem] flex items-center text-base text-slate-900">
            ${selectedItem
              ? html`<span>${unsafeHTML(selectedItem.label)}</span>`
              : (this.placeholder || this.msg.placeholder || '—')
            }
          </div>
        </div>
      `;
    }
    // Edit Mode
    const hasError = !!this.error;
    const ariaDescribedBy = hasError ? 'error' : (this.hasSlot('Helper') ? 'helper' : undefined);
    return html`
      <div class="flex flex-col gap-1 w-full">
        ${this.hasSlot('Label') ? html`
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium text-slate-700" id="label">${unsafeHTML(this.getSlotContent('Label'))}</span>
            ${this.required ? html`<span class="text-xs text-red-500 ml-1">*</span>` : nothing}
          </div>
        ` : nothing}
        <div
          class="flex w-full rounded-lg border ${
            hasError
              ? 'border-red-500 bg-red-50'
              : this.disabled
                ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                : 'border-slate-200 bg-white'
          } px-1 py-1 gap-1 transition-all"
          role="group"
          aria-labelledby="label"
          aria-disabled="${this.disabled || this.loading}"
          aria-readonly="${this.readonly}"
          aria-invalid="${hasError}"
          aria-required="${this.required}"
        >
          ${this.loading
            ? html`
                <div class="flex-1 flex items-center justify-center min-h-[2.5rem]">
                  <svg class="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  <span class="ml-2 text-slate-400 text-sm">${this.msg.loading}</span>
                </div>
              `
            : allItems.map(item => {
                const isSelected = this.value === item.value;
                const isDisabled = this.disabled || item.disabled || this.loading || this.readonly;
                return html`
                  <button
                    type="button"
                    class="flex-1 min-w-0 px-3 py-2 rounded-md text-sm font-medium border transition-all
                      ${isSelected
                        ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm'
                        : 'border-transparent bg-white text-slate-700 hover:bg-slate-50'}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      focus:z-10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    role="option"
                    aria-selected="${isSelected}"
                    aria-disabled="${isDisabled}"
                    ?disabled=${isDisabled}
                    @click=${() => !isDisabled && this.handleSelect(item.value)}
                    @blur=${this.handleBlur}
                    @focus=${this.handleFocus}
                    name="${this.name}"
                    tabindex="0"
                  >
                    ${unsafeHTML(item.label)}
                  </button>
                `;
              })
          }
        </div>
        ${hasError
          ? html`<div id="error" class="mt-1 text-xs text-red-600">${this.error}</div>`
          : this.hasSlot('Helper')
            ? html`<div id="helper" class="mt-1 text-xs text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
            : nothing
        }
      </div>
    `;
  }
}
