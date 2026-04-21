/// <mls fileReference="_102020_/l2/molecules/groupLocatePosition/positionOccurrence.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// POSITION OCCURRENCE MOLECULE
// =============================================================================
// Skill Group: locate + position
// Tag: molecules--group-locate-position--position-occurrence-102020
// This molecule does NOT contain business logic.
import {
  html,
  TemplateResult,
  nothing,
  unsafeHTML
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Search address or coordinates',
  noResults: 'No results found',
  loading: 'Locating...',
  useCurrent: 'Use current location',
  remove: 'Remove location',
  errorGps: 'Could not obtain your location',
  notSelected: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Buscar endereço ou coordenadas',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Localizando...',
    useCurrent: 'Usar localização atual',
    remove: 'Remover localização',
    errorGps: 'Não foi possível obter sua localização',
    notSelected: '—',
  },
};
/// **collab_i18n_end**
@customElement('molecules--group-locate-position--position-occurrence-102020')
export class GroupLocatePositionPositionOccurrenceMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Suggestions', 'Item', 'Empty'];
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
  private gpsLoading: boolean = false;
  @state()
  private gpsError: string = '';
  // ===========================================================================
  // STATE CHANGE HANDLER (for derived values)
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    // If value changes externally, update searchQuery to label if possible
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      // Try to update searchQuery to label of selected value
      const label = this.getLabelForValue(value);
      this.searchQuery = label || '';
    }
    this.requestUpdate();
  }
  // ===========================================================================
  // PARSING HELPERS
  // ==========================================================================
  private parseValue(): { lat: number; lng: number } | null {
    if (!this.value) return null;
    const [lat, lng] = this.value.split(',').map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
  }
  private getSuggestions(): { value: string; label: string }[] {
    const suggestionsEl = this.getSlot('Suggestions');
    if (!suggestionsEl) return [];
    return Array.from(suggestionsEl.querySelectorAll('Item')).map(el => ({
      value: el.getAttribute('value') || '',
      label: el.innerHTML,
    }));
  }
  private getLabelForValue(val: string | null): string {
    if (!val) return '';
    const items = this.getSuggestions();
    const found = items.find(i => i.value === val);
    return found ? found.label : val;
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
      detail: { query: this.searchQuery }
    }));
  }
  private handleFocus() {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }
  private handleBlur() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }
  private handleSelectSuggestion(item: { value: string; label: string }) {
    if (this.disabled || this.readonly) return;
    this.value = item.value;
    this.searchQuery = item.label;
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }
  private handleGeolocate() {
    if (this.gpsLoading || this.loading || this.disabled || this.readonly) return;
    this.gpsLoading = true;
    this.gpsError = '';
    if (!navigator.geolocation) {
      this.gpsError = this.msg.errorGps;
      this.gpsLoading = false;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.value = `${lat},${lng}`;
        this.gpsLoading = false;
        this.gpsError = '';
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        }));
        // Ask page to resolve address for these coordinates
        this.dispatchEvent(new CustomEvent('search', {
          bubbles: true,
          composed: true,
          detail: { query: `${lat},${lng}` }
        }));
      },
      err => {
        this.gpsError = this.msg.errorGps;
        this.gpsLoading = false;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
  private handleRemoveLocation() {
    if (this.disabled || this.readonly) return;
    this.value = null;
    this.searchQuery = '';
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: null }
    }));
  }
  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private renderLabel(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Label')) return nothing;
    return html`<div id="label" class="mb-1 text-sm font-medium text-slate-700">
      ${unsafeHTML(this.getSlotContent('Label'))}
    </div>`;
  }
  private renderHelperOrError(): TemplateResult | typeof nothing {
    if (!this.isEditing) return nothing;
    if (this.error) {
      return html`<div id="error" class="mt-1 text-xs text-red-600">${this.error}</div>`;
    }
    if (this.gpsError) {
      return html`<div class="mt-1 text-xs text-red-600">${this.gpsError}</div>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<div id="helper" class="mt-1 text-xs text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
    }
    return nothing;
  }
  private renderGeolocateButton(): TemplateResult {
    const triggerContent = this.hasSlot('Trigger')
      ? unsafeHTML(this.getSlotContent('Trigger'))
      : this.msg.useCurrent;
    return html`
      <button
        type="button"
        class="ml-2 px-2 py-1 rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        ?disabled=${this.gpsLoading || this.loading || this.disabled || this.readonly}
        aria-label="${this.msg.useCurrent}"
        @click=${this.handleGeolocate.bind(this)}
      >
        ${this.gpsLoading ? html`<span class="animate-spin mr-1">⏳</span>` : nothing}
        ${triggerContent}
      </button>
    `;
  }
  private renderRemoveButton(): TemplateResult {
    return html`
      <button
        type="button"
        class="ml-2 px-2 py-1 rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-50"
        @click=${this.handleRemoveLocation.bind(this)}
        ?disabled=${this.disabled || this.readonly}
        aria-label="${this.msg.remove}"
      >
        🗑️
      </button>
    `;
  }
  private renderSuggestions(): TemplateResult | typeof nothing {
    if (!this.isOpen || !this.hasSlot('Suggestions')) return nothing;
    const items = this.getSuggestions();
    if (items.length === 0) {
      const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.noResults;
      return html`<div class="p-2 text-slate-500 text-sm">${unsafeHTML(emptyContent)}</div>`;
    }
    return html`
      <div role="listbox" class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded shadow-lg max-h-56 overflow-auto">
        ${items.map(item => {
          const selected = item.value === this.value;
          return html`
            <div
              role="option"
              aria-selected="${selected}"
              class="px-3 py-2 cursor-pointer text-sm ${selected ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50'}"
              @click=${() => this.handleSelectSuggestion(item)}
            >
              ${unsafeHTML(item.label)}
            </div>
          `;
        })}
      </div>
    `;
  }
  private renderMap(): TemplateResult | typeof nothing {
    if (!this.showMap) return nothing;
    const coords = this.parseValue();
    if (!coords) return nothing;
    // Placeholder: developer must provide map integration in organism/page
    return html`
      <div class="mt-2 w-full h-40 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-xs text-slate-500">
        [Map preview: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}]
      </div>
    `;
  }
  private renderViewMode(): TemplateResult {
    const coords = this.parseValue();
    const label = this.getLabelForValue(this.value);
    return html`
      <div class="flex flex-col">
        ${this.renderLabel()}
        <div class="min-h-[2.5rem] flex items-center text-slate-900 text-sm">
          ${this.value
            ? html`<span>${unsafeHTML(label)}</span>`
            : html`<span class="text-slate-400">${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.notSelected}</span>`
          }
        </div>
        ${this.showMap && coords ? this.renderMap() : nothing}
      </div>
    `;
  }
  private renderEditMode(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const inputId = `locate-input-${this.name || 'field'}`;
    const hasError = !!this.error || !!this.gpsError;
    const coords = this.parseValue();
    return html`
      <div class="flex flex-col relative">
        ${this.renderLabel()}
        <div class="flex items-center">
          <input
            id="${inputId}"
            class="w-full rounded-md px-3 py-2 text-sm border transition ${hasError ? 'border-red-500' : 'border-slate-200'} ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${this.readonly ? 'bg-slate-50' : 'bg-white'}"
            type="text"
            .value=${this.searchQuery}
            ?disabled=${this.disabled || this.loading || this.gpsLoading}
            ?readonly=${this.readonly}
            placeholder="${this.placeholder || this.msg.placeholder}"
            role="combobox"
            aria-expanded="${this.isOpen}"
            aria-autocomplete="list"
            aria-controls="${inputId}-listbox"
            aria-invalid="${hasError}"
            aria-required="${this.required}"
            aria-labelledby="label"
            aria-describedby="${hasError ? 'error' : 'helper'}"
            @input=${this.handleInput.bind(this)}
            @focus=${() => { this.isOpen = true; this.handleFocus(); }}
            @blur=${this.handleBlur.bind(this)}
            autocomplete="off"
          />
          ${this.allowGeolocation ? this.renderGeolocateButton() : nothing}
          ${coords && !this.disabled && !this.readonly ? this.renderRemoveButton() : nothing}
        </div>
        <div class="absolute left-0 right-0 top-full">
          ${this.renderSuggestions()}
        </div>
        ${this.showMap && coords ? this.renderMap() : nothing}
        ${this.renderHelperOrError()}
      </div>
    `;
  }
  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    if (!this.isEditing) {
      return this.renderViewMode();
    }
    return this.renderEditMode();
  }
}
