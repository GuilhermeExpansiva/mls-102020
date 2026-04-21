/// <mls fileReference="_102020_/l2/molecules/groupLocatePosition/mapGps.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// MAP GPS MOLECULE
// =============================================================================
// Skill Group: locate + position
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Search for a location',
  noResults: 'No results found',
  loading: 'Loading...',
  useCurrent: 'Use current location',
  empty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Buscar um local',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
    useCurrent: 'Usar localização atual',
    empty: '—',
  },
};
/// **collab_i18n_end**
@customElement('molecules--group-locate-position--map-gps-102020')
export class GroupLocatePositionMapGpsMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Empty'];
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
  suggestions: string = '[]';
  @propertyDataSource({ type: String })
  placeholder: string = '';
  @propertyDataSource({ type: Boolean, attribute: 'show-map' })
  showMap: boolean = false;
  @propertyDataSource({ type: Boolean, attribute: 'allow-geolocation' })
  allowGeolocation: boolean = false;
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
  @state()
  private isOpen: boolean = false;
  @state()
  private isFocused: boolean = false;
  // ===========================================================================
  // STATE CHANGE HANDLER (for derived values)
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    // If value changed externally, update searchQuery
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      const loc = value ? this.parseLocation(value) : null;
      this.searchQuery = loc && loc.address ? loc.address : '';
    }
    this.requestUpdate();
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleInput(e: Event) {
    if (this.disabled || this.readonly) return;
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.isOpen = true;
    this.dispatchEvent(new CustomEvent('search', {
      bubbles: true,
      composed: true,
      detail: { query: this.searchQuery },
    }));
  }
  private handleFocus() {
    this.isFocused = true;
    this.isOpen = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleBlur() {
    this.isFocused = false;
    // Delay closing to allow click on suggestion
    setTimeout(() => {
      this.isOpen = false;
      this.requestUpdate();
    }, 120);
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }
  private handleSuggestionClick(suggestion: any) {
    if (this.disabled || this.readonly) return;
    this.value = JSON.stringify(suggestion);
    this.searchQuery = suggestion.address || '';
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }
  private handleGeolocation() {
    if (!navigator.geolocation || this.disabled || this.readonly) return;
    this.loading = true;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Set value with empty address, page will resolve address
        const loc = { lat, lng, address: '' };
        this.value = JSON.stringify(loc);
        this.searchQuery = '';
        this.isOpen = false;
        this.loading = false;
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: { value: this.value },
        }));
        // Ask page to resolve address
        this.dispatchEvent(new CustomEvent('search', {
          bubbles: true,
          composed: true,
          detail: { query: `${lat},${lng}` },
        }));
      },
      err => {
        this.loading = false;
        // Optionally, set error (page should handle error state)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  // ===========================================================================
  // HELPERS
  // ==========================================================================
  private parseLocation(val: string | null): { lat: number; lng: number; address: string } | null {
    if (!val) return null;
    try {
      const obj = JSON.parse(val);
      if (typeof obj.lat === 'number' && typeof obj.lng === 'number') {
        return { lat: obj.lat, lng: obj.lng, address: obj.address || '' };
      }
      return null;
    } catch {
      return null;
    }
  }
  private parseSuggestions(): Array<{ lat: number; lng: number; address: string }> {
    if (!this.suggestions) return [];
    try {
      const arr = JSON.parse(this.suggestions);
      if (Array.isArray(arr)) return arr;
      return [];
    } catch {
      return [];
    }
  }
  private getInputClasses(): string {
    return [
      'w-full px-3 py-2 rounded-md border text-sm transition',
      this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'bg-white',
      this.readonly ? 'bg-slate-50 cursor-default' : '',
      this.error && this.error !== '' ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-sky-500',
      this.isFocused ? 'ring-2 ring-sky-500 border-sky-500' : '',
    ].filter(Boolean).join(' ');
  }
  private getSuggestionClasses(selected: boolean): string {
    return [
      'px-3 py-2 cursor-pointer text-sm',
      selected ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50',
    ].join(' ');
  }
  private renderMapPreview(location: { lat: number; lng: number; address: string } | null): TemplateResult | typeof nothing {
    if (!location) return nothing;
    // Simple static map preview (OpenStreetMap static image)
    const { lat, lng } = location;
    const src = `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=15&size=400,160&l=map&pt=${lng},${lat},pm2rdm`;
    return html`
      <div class="mt-2 rounded overflow-hidden border border-slate-200">
        <img src="${src}" alt="Map preview" class="w-full h-40 object-cover" loading="lazy" />
      </div>
    `;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    // View Mode
    if (!this.isEditing) {
      const location = this.parseLocation(this.value);
      return html`
        <div class="flex flex-col gap-1">
          ${this.hasSlot('Label')
            ? html`<label class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}</label>`
            : nothing}
          <div class="min-h-[2.5rem] text-slate-900 text-sm">
            ${location && location.address
              ? html`<span>${location.address}</span>`
              : this.hasSlot('Empty')
                ? html`<span class="text-slate-400">${unsafeHTML(this.getSlotContent('Empty'))}</span>`
                : html`<span class="text-slate-400">${this.msg.empty}</span>`}
          </div>
          ${this.showMap && location ? this.renderMapPreview(location) : nothing}
        </div>
      `;
    }
    // Edit Mode
    const location = this.parseLocation(this.value);
    const suggestions = this.parseSuggestions();
    const showSuggestions = this.isOpen && !this.loading && this.searchQuery.length > 0;
    const inputId = `locate-input-${this.name || 'field'}`;
    const labelId = this.hasSlot('Label') ? `${inputId}-label` : undefined;
    const errorId = this.error && this.error !== '' ? `${inputId}-error` : undefined;
    return html`
      <div class="flex flex-col gap-1">
        ${this.hasSlot('Label')
          ? html`<label id="${labelId}" for="${inputId}" class="text-sm font-medium text-slate-700 mb-1">${unsafeHTML(this.getSlotContent('Label'))}</label>`
          : nothing}
        <div class="relative flex items-center gap-2">
          <input
            id="${inputId}"
            class="${this.getInputClasses()}"
            type="text"
            .value="${this.searchQuery}"
            ?disabled="${this.disabled || this.loading}"
            ?readonly="${this.readonly}"
            placeholder="${this.placeholder || this.msg.placeholder}"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="${showSuggestions}"
            aria-controls="${inputId}-listbox"
            aria-activedescendant=""
            aria-labelledby="${labelId || ''}"
            aria-describedby="${errorId || ''}"
            aria-invalid="${!!this.error && this.error !== ''}"
            aria-required="${this.required}"
            @input="${this.handleInput}"
            @focus="${this.handleFocus}"
            @blur="${this.handleBlur}"
            autocomplete="off"
          />
          ${this.allowGeolocation
            ? html`
                <button
                  type="button"
                  class="inline-flex items-center px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  ?disabled="${this.disabled || this.loading}"
                  aria-label="${this.msg.useCurrent}"
                  @click="${() => this.handleGeolocation()}"
                  tabindex="-1"
                >
                  ${this.hasSlot('Trigger')
                    ? html`${unsafeHTML(this.getSlotContent('Trigger'))}`
                    : html`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>`}
                </button>
              `
            : nothing}
          ${this.loading
            ? html`<span class="absolute right-2"><svg class="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></span>`
            : nothing}
        </div>
        ${showSuggestions
          ? html`
              <div
                id="${inputId}-listbox"
                role="listbox"
                class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded shadow-lg max-h-56 overflow-auto"
              >
                ${suggestions.length > 0
                  ? suggestions.map((s, i) => html`
                      <div
                        role="option"
                        aria-selected="false"
                        class="${this.getSuggestionClasses(false)}"
                        @mousedown="${(e: Event) => { e.preventDefault(); this.handleSuggestionClick(s); }}"
                      >
                        ${s.address}
                      </div>
                    `)
                  : this.hasSlot('Empty')
                    ? html`<div class="px-3 py-2 text-slate-400">${unsafeHTML(this.getSlotContent('Empty'))}</div>`
                    : html`<div class="px-3 py-2 text-slate-400">${this.msg.noResults}</div>`}
              </div>
            `
          : nothing}
        ${this.showMap && location ? this.renderMapPreview(location) : nothing}
        ${this.error && this.error !== ''
          ? html`<div id="${errorId}" class="text-xs text-red-600 mt-1">${this.error}</div>`
          : this.hasSlot('Helper')
            ? html`<div class="text-xs text-slate-500 mt-1">${unsafeHTML(this.getSlotContent('Helper'))}</div>`
            : nothing}
      </div>
    `;
  }
}
