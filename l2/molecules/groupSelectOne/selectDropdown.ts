/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/selectDropdown.ts" enhancement="_102020_/l2/enhancementAura" />
// =============================================================================
// SELECT DROPDOWN MOLECULE (groupSelectOne)
// =============================================================================
// Skill Group: select + one
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  noResults: 'No results found',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma opção',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**
@customElement('molecules--group-select-one--select-dropdown-102020')
export class SelectDropdownMolecule extends MoleculeAuraElement {
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
  // ===========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private isOpen: boolean = false;
  @state()
  private searchQuery: string = '';
  // ===========================================================================
  // LIFECYCLE: Outside click handler
  // ==========================================================================
  private handleDocumentClick = (e: MouseEvent) => {
    if (!this.isOpen) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.isOpen = false;
      this.requestUpdate();
    }
  };
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleTriggerClick(e: MouseEvent) {
    if (this.disabled || this.readonly || this.loading) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dispatchEvent(new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      }));
    }
  }
  private handleBlur() {
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
  }
  private handleItemClick(item: { value: string; disabled: boolean }) {
    if (item.disabled) return;
    this.value = item.value;
    this.isOpen = false;
    this.searchQuery = '';
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }
  private handlePanelKeydown(e: KeyboardEvent, items: { value: string; label: string; disabled: boolean }[]) {
    // Keyboard navigation: ArrowDown, ArrowUp, Enter, Escape
    const enabledItems = items.filter(i => !i.disabled);
    const currentIdx = enabledItems.findIndex(i => i.value === this.value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = currentIdx < enabledItems.length - 1 ? currentIdx + 1 : 0;
      this.value = enabledItems[nextIdx]?.value || null;
      this.requestUpdate();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = currentIdx > 0 ? currentIdx - 1 : enabledItems.length - 1;
      this.value = enabledItems[prevIdx]?.value || null;
      this.requestUpdate();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.value !== null) {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: { value: this.value },
        }));
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.isOpen = false;
      this.requestUpdate();
    }
  }
  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private getTriggerLabel(items: { value: string; label: string; disabled: boolean }[]): string {
    if (this.value === null) return '';
    const selected = items.find(i => i.value === this.value);
    return selected ? selected.label : '';
  }
  private getPlaceholder(): string {
    return (
      this.getSlotAttr('Trigger', 'placeholder') ||
      this.placeholder ||
      this.msg.placeholder
    );
  }
  private getPanelItems(): { value: string; label: string; disabled: boolean }[] {
    // Standalone items (not in groups)
    return this.getSlots('Item').map(el => ({
      value: el.getAttribute('value') || '',
      label: el.innerHTML,
      disabled: el.hasAttribute('disabled'),
    }));
  }
  private getPanelGroups(): { label: string; items: { value: string; label: string; disabled: boolean }[] }[] {
    return this.getSlots('Group').map(group => ({
      label: group.getAttribute('label') || '',
      items: Array.from(group.querySelectorAll('Item')).map(el => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML,
        disabled: el.hasAttribute('disabled'),
      })),
    }));
  }
  private renderLabel(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Label')) return nothing;
    return html`<div id="label" class="mb-1 text-sm font-medium text-slate-700">${unsafeHTML(this.getSlotContent('Label'))}</div>`;
  }
  private renderHelper(): TemplateResult | typeof nothing {
    if (this.error || !this.hasSlot('Helper')) return nothing;
    return html`<div id="helper" class="mt-1 text-xs text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
  }
  private renderError(): TemplateResult | typeof nothing {
    if (!this.error) return nothing;
    return html`<div id="error" class="mt-1 text-xs text-red-600">${unsafeHTML(this.error)}</div>`;
  }
  private renderLoading(): TemplateResult {
    return html`<div class="flex items-center gap-2 text-slate-500">
      <span class="animate-spin h-4 w-4 border-2 border-slate-300 border-t-sky-500 rounded-full"></span>
      ${this.msg.loading}
    </div>`;
  }
  private renderPanel(
    items: { value: string; label: string; disabled: boolean }[],
    groups: { label: string; items: { value: string; label: string; disabled: boolean }[] }[]
  ): TemplateResult {
    // Filter items/groups by searchQuery if searchable
    const q = this.searchQuery.toLowerCase();
    let filteredItems = items;
    let filteredGroups = groups;
    if (this.searchable && q) {
      filteredItems = items.filter(i => i.label.toLowerCase().includes(q));
      filteredGroups = groups
        .map(g => ({
          label: g.label,
          items: g.items.filter(i => i.label.toLowerCase().includes(q)),
        }))
        .filter(g => g.items.length > 0);
    }
    const hasAny = filteredItems.length > 0 || filteredGroups.length > 0;
    return html`
      <div
        class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto"
        role="listbox"
        @keydown=${(e: KeyboardEvent) => this.handlePanelKeydown(e, [...filteredItems, ...filteredGroups.flatMap(g => g.items)])}
      >
        ${this.searchable
          ? html`<div class="p-2"><input
              type="text"
              class="w-full px-2 py-1 border border-slate-200 rounded text-sm"
              placeholder="Search..."
              .value=${this.searchQuery}
              @input=${this.handleSearchInput}
            /></div>`
          : nothing}
        ${filteredGroups.map(group => html`
          <div class="px-3 py-2 text-xs font-semibold text-slate-500">${unsafeHTML(group.label)}</div>
          ${group.items.map(item => this.renderPanelItem(item))}
        `)}
        ${filteredItems.map(item => this.renderPanelItem(item))}
        ${!hasAny
          ? html`<div class="px-3 py-2 text-slate-500">${unsafeHTML(this.getSlotContent('Empty') || this.msg.noResults)}</div>`
          : nothing}
      </div>
    `;
  }
  private renderPanelItem(item: { value: string; label: string; disabled: boolean }): TemplateResult {
    const isSelected = this.value === item.value;
    const classes = [
      'w-full px-3 py-2 text-sm rounded-md cursor-pointer transition',
      isSelected ? 'bg-sky-50 text-sky-900 font-semibold' : 'bg-white text-slate-900',
      item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50',
      isSelected ? 'border border-sky-500' : '',
    ].filter(Boolean).join(' ');
    return html`<div
      class="${classes}"
      role="option"
      aria-selected="${isSelected}"
      aria-disabled="${item.disabled}"
      @click=${() => this.handleItemClick(item)}
    >${unsafeHTML(item.label)}</div>`;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    // Read items/groups inline
    const items = this.getPanelItems();
    const groups = this.getPanelGroups();
    const selectedLabel = this.getTriggerLabel(items);
    // VIEW MODE
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col">
          ${this.renderLabel()}
          <div class="min-h-[2.5rem] flex items-center px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-900 text-sm">
            ${selectedLabel
              ? html`${unsafeHTML(selectedLabel)}`
              : html`<span class="text-slate-400">${this.getPlaceholder() || '—'}</span>`}
          </div>
        </div>
      `;
    }
    // EDIT MODE
    const triggerId = 'trigger-' + Math.random().toString(36).slice(2);
    const errorId = this.error ? 'error-' + Math.random().toString(36).slice(2) : '';
    const ariaLabelledBy = this.hasSlot('Label') ? 'label' : triggerId;
    const ariaDescribedBy = this.error ? errorId : (this.hasSlot('Helper') ? 'helper' : '');
    const triggerClasses = [
      'w-full flex items-center justify-between px-3 py-2 rounded-md border text-sm transition',
      this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer bg-white hover:bg-slate-50',
      this.readonly ? 'bg-slate-50 cursor-default' : '',
      this.error ? 'border-red-500' : 'border-slate-200',
      this.isOpen ? 'border-sky-500 ring-2 ring-sky-200' : '',
    ].filter(Boolean).join(' ');
    return html`
      <div class="relative flex flex-col">
        ${this.renderLabel()}
        <button
          id="${triggerId}"
          class="${triggerClasses}"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded="${this.isOpen}"
          aria-labelledby="${ariaLabelledBy}"
          aria-describedby="${ariaDescribedBy}"
          aria-invalid="${!!this.error}"
          aria-required="${this.required}"
          name="${this.name}"
          @click=${this.handleTriggerClick}
          @blur=${this.handleBlur}
          ?disabled=${this.disabled || this.loading}
          ?readonly=${this.readonly}
        >
          <span class="flex-1 text-left">
            ${this.loading
              ? this.renderLoading()
              : selectedLabel
                ? html`${unsafeHTML(selectedLabel)}`
                : this.hasSlot('Trigger')
                  ? html`${unsafeHTML(this.getSlotContent('Trigger'))}`
                  : html`<span class="text-slate-400">${this.getPlaceholder() || '—'}</span>`}
          </span>
          <span class="ml-2">
            <svg class="w-4 h-4 text-slate-400 transition-transform ${this.isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          </span>
        </button>
        ${this.isOpen && !this.loading
          ? this.renderPanel(items, groups)
          : nothing}
        ${this.error ? html`<div id="${errorId}">${this.renderError()}</div>` : this.renderHelper()}
      </div>
    `;
  }
}
