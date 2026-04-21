/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/radioGroupSelect.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// RADIO GROUP SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// Tag: molecules--group-select-one--radio-group-select-102020
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
    placeholder: 'Select an option',
    noResults: 'No options available',
    loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
    en: message_en,
    pt: {
        placeholder: 'Selecione uma opção',
        noResults: 'Nenhuma opção disponível',
        loading: 'Carregando...'
    },
};
/// **collab_i18n_end**
@customElement('molecules--group-select-one--radio-group-select-102020')
export class RadioGroupSelectMolecule extends MoleculeAuraElement {
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
    searchable: boolean = false;
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
    // Orientation: vertical (default) or horizontal
    @property({ type: String })
    orientation: 'vertical' | 'horizontal' = 'vertical';
    // ===========================================================================
    // INTERNAL STATE
    // ==========================================================================
    @state()
    private searchQuery: string = '';

    // Stable radio name — generated once, reused across renders
    private _radioName: string = '';
    // ===========================================================================
    // EVENT HANDLERS
    // ==========================================================================
    private handleRadioChange(e: Event) {
        if (this.disabled || this.readonly || this.loading) return;
        const input = e.target as HTMLInputElement;
        const newValue = input.value;
        if (this.value !== newValue) {
            this.value = newValue;
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value: newValue }
            }));
        }
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
    private handleSearchInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.searchQuery = input.value;
    }
    // ===========================================================================
    // RENDER HELPERS
    // ==========================================================================
    private getParsedItems(): Array<{ value: string, label: string, disabled: boolean }> {
        return this.getSlots('Item')
            .filter(el => !el.parentElement?.tagName?.toUpperCase()?.startsWith('GROUP'))
            .map(el => ({
                value: el.getAttribute('value') || '',
                label: el.innerHTML,
                disabled: el.hasAttribute('disabled'),
            }));
    }
    private getParsedGroups(): Array<{ label: string, items: Array<{ value: string, label: string, disabled: boolean }> }> {
        return this.getSlots('Group').map(group => ({
            label: group.getAttribute('label') || '',
            items: Array.from(group.querySelectorAll('Item')).map(el => ({
                value: el.getAttribute('value') || '',
                label: el.innerHTML,
                disabled: el.hasAttribute('disabled'),
            }))
        }));
    }
    private getAllItems(
        items: Array<{ value: string, label: string, disabled: boolean }>,
        groups: Array<{ label: string, items: Array<{ value: string, label: string, disabled: boolean }> }>
    ): Array<{ value: string, label: string, disabled: boolean }> {
        return [...groups.flatMap(g => g.items), ...items];
    }
    private getSelectedLabel(allItems: Array<{ value: string, label: string, disabled: boolean }>): string | null {
        if (this.value === null) return null;
        const found = allItems.find(i => i.value === this.value);
        return found ? found.label : null;
    }
    private getRadioName(): string {
        if (this.name) return this.name;
        if (!this._radioName) {
            this._radioName = `radio-group-${this.id || Math.random().toString(36).slice(2)}`;
        }
        return this._radioName;
    }
    private getFilteredItems(items: Array<{ value: string, label: string, disabled: boolean }>): Array<{ value: string, label: string, disabled: boolean }> {
        if (!this.searchable || !this.searchQuery) return items;
        const q = this.searchQuery.toLowerCase();
        return items.filter(i => i.label.toLowerCase().includes(q));
    }
    private getFilteredGroups(groups: Array<{ label: string, items: Array<{ value: string, label: string, disabled: boolean }> }>): Array<{ label: string, items: Array<{ value: string, label: string, disabled: boolean }> }> {
        if (!this.searchable || !this.searchQuery) return groups;
        const q = this.searchQuery.toLowerCase();
        return groups
            .map(g => ({
                label: g.label,
                items: g.items.filter(i => i.label.toLowerCase().includes(q))
            }))
            .filter(g => g.items.length > 0);
    }
    // ===========================================================================
    // RENDER
    // ==========================================================================
    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const labelId = this.hasSlot('Label') ? `label-${this.id}` : undefined;
        const errorId = this.error ? `error-${this.id}` : undefined;
        const groups = this.getParsedGroups();
        const items = this.getParsedItems();
        const allItems = this.getAllItems(items, groups);
        const filteredGroups = this.getFilteredGroups(groups);
        const filteredItems = this.getFilteredItems(items);
        const selectedLabel = this.getSelectedLabel(allItems);
        // View Mode
        if (!this.isEditing) {
            return html`
        <div class="flex flex-col gap-1">
          ${this.hasSlot('Label') ? html`<div id="${labelId}" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
          <div class="text-slate-900 text-base min-h-[2.25rem] flex items-center">
            ${selectedLabel ? html`${unsafeHTML(selectedLabel)}` : (this.placeholder || this.msg.placeholder || '—')}
          </div>
        </div>
      `;
        }
        // Loading state
        if (this.loading) {
            return html`
        <div class="flex flex-col gap-1">
          ${this.hasSlot('Label') ? html`<div id="${labelId}" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}</div>` : nothing}
          <div class="flex items-center min-h-[2.25rem]">
            <svg class="animate-spin h-5 w-5 text-slate-400 mr-2" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
            <span class="text-slate-500">${this.msg.loading}</span>
          </div>
        </div>
      `;
        }
        // Edit Mode
        const showError = !!this.error;
        const orientationClass = this.orientation === 'horizontal'
            ? 'flex flex-row gap-6'
            : 'flex flex-col gap-2';
        return html`
      <div class="flex flex-col gap-1">
        ${this.hasSlot('Label') ? html`<div id="${labelId}" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}${this.required ? html`<span class="text-red-500 ml-1">*</span>` : nothing}</div>` : nothing}
        <div
          class="${orientationClass}"
          role="radiogroup"
          aria-labelledby="${ifDefined(labelId)}"
          aria-describedby="${ifDefined(errorId)}"
          aria-invalid="${showError ? 'true' : 'false'}"
          aria-required="${this.required ? 'true' : 'false'}"
        >
          ${filteredGroups.length > 0
                ? filteredGroups.map(group => html`
                <div class="flex flex-col gap-1">
                  <div class="text-xs font-semibold text-slate-500 mb-1">${group.label}</div>
                  <div class="${orientationClass}">
                    ${group.items.map(item => this.renderRadioItem(item))}
                  </div>
                </div>
              `)
                : nothing}
          ${filteredItems.length > 0
                ? filteredItems.map(item => this.renderRadioItem(item))
                : nothing}
          ${(filteredGroups.length === 0 && filteredItems.length === 0)
                ? (this.hasSlot('Empty')
                    ? html`<div class="text-slate-400 text-sm">${unsafeHTML(this.getSlotContent('Empty'))}</div>`
                    : html`<div class="text-slate-400 text-sm">${this.msg.noResults}</div>`)
                : nothing}
        </div>
        ${showError
                ? html`<div id="${errorId}" class="text-xs text-red-600 mt-1">${this.error}</div>`
                : (this.hasSlot('Helper')
                    ? html`<div class="text-xs text-slate-500 mt-1">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
                    : nothing)
            }
      </div>
    `;
    }
    private renderRadioItem(item: { value: string, label: string, disabled: boolean }): TemplateResult {
        const checked = this.value === item.value;
        const isDisabled = this.disabled || this.loading || item.disabled;
        const isReadonly = this.readonly;
        const radioOuter = [
            'relative flex items-center',
            isDisabled ? 'opacity-50 cursor-not-allowed' : (isReadonly ? 'cursor-default' : 'cursor-pointer'),
            checked ? 'font-semibold text-sky-700' : 'text-slate-900',
            'select-none'
        ].join(' ');
        const radioInput = [
            'form-radio h-5 w-5 text-sky-600 border-slate-300',
            checked ? 'ring-2 ring-sky-500' : '',
            isDisabled ? 'bg-slate-100' : '',
            isReadonly ? 'pointer-events-none' : '',
        ].join(' ');
        return html`
      <label class="${radioOuter}">
        <input
          type="radio"
          class="${radioInput}"
          name="${this.getRadioName()}"
          .value="${item.value}"
          ?checked="${checked}"
          ?disabled="${isDisabled || isReadonly}"
          aria-checked="${checked}"
          aria-disabled="${isDisabled || isReadonly}"
          @change="${this.handleRadioChange}"
          @blur="${this.handleBlur}"
          @focus="${this.handleFocus}"
          tabindex="0"
        />
        <span class="ml-2">${unsafeHTML(item.label)}</span>
      </label>
    `;
    }
}