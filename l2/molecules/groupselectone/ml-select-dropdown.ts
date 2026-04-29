/// <mls fileReference="_102020_/l2/molecules/groupselectone/ml-select-dropdown.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML SELECT DROPDOWN MOLECULE
// =============================================================================
// Skill Group: select + one
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing, unsafeHTML, ifDefined } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
placeholder: 'Select an option',
noResults: 'No results found',
loading: 'Loading...',
required: 'Required field',
searchPlaceholder: 'Search...',
viewEmpty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
placeholder: 'Selecione uma opção',
noResults: 'Nenhum resultado encontrado',
loading: 'Carregando...',
required: 'Campo obrigatório',
searchPlaceholder: 'Buscar...',
viewEmpty: '—',
},
};
/// **collab_i18n_end**

type ParsedItem = {
value: string;
label: string;
disabled: boolean;
};

type ParsedGroup = {
label: string;
items: ParsedItem[];
};

@customElement('groupselectone--ml-select-dropdown')
export class MlSelectDropdownMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
value: string | null = null;
@propertyDataSource({ type: String })
error = '';
@propertyDataSource({ type: String })
name = '';
@propertyDataSource({ type: String })
placeholder = '';
@propertyDataSource({ type: Boolean })
searchable = false;
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing = true;
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
readonly = false;
@propertyDataSource({ type: Boolean })
required = false;
@propertyDataSource({ type: Boolean })
loading = false;
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private isOpen = false;
@state()
private searchQuery = '';
@state()
private activeIndex = -1;
// ===========================================================================
// PRIVATE FIELDS
// ===========================================================================
private labelId = `ml-label-${Math.random().toString(36).slice(2)}`;
private helperId = `ml-helper-${Math.random().toString(36).slice(2)}`;
private errorId = `ml-error-${Math.random().toString(36).slice(2)}`;
private visibleItems: ParsedItem[] = [];
// ===========================================================================
// LIFECYCLE
// ===========================================================================
connectedCallback() {
super.connectedCallback();
document.addEventListener('click', this.handleDocumentClick);
}

disconnectedCallback() {
document.removeEventListener('click', this.handleDocumentClick);
super.disconnectedCallback();
}

updated() {
if ((this.loading || this.disabled || this.readonly || !this.isEditing) && this.isOpen) {
this.isOpen = false;
this.activeIndex = -1;
}
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleDocumentClick = (event: MouseEvent) => {
if (!this.isOpen) return;
const path = event.composedPath();
if (!path.includes(this)) {
this.isOpen = false;
this.activeIndex = -1;
}
};

private handleTriggerClick() {
if (this.disabled || this.readonly || this.loading) return;
this.isOpen = !this.isOpen;
if (this.isOpen) {
this.setActiveIndexFromValue();
} else {
this.activeIndex = -1;
}
}

private handleTriggerKeyDown(event: KeyboardEvent) {
if (this.disabled || this.readonly || this.loading) return;
const key = event.key;
if (key === 'ArrowDown' || key === 'ArrowUp') {
event.preventDefault();
this.openDropdown();
this.moveActiveIndex(key === 'ArrowDown' ? 1 : -1);
}
if (key === 'Enter' || key === ' ') {
event.preventDefault();
if (!this.isOpen) {
this.openDropdown();
} else if (this.activeIndex >= 0) {
const item = this.visibleItems[this.activeIndex];
if (item && !item.disabled) {
this.selectItem(item.value);
}
}
}
if (key === 'Escape' && this.isOpen) {
event.preventDefault();
this.closeDropdown();
}
}

private handlePanelKeyDown(event: KeyboardEvent) {
const key = event.key;
if (key === 'ArrowDown' || key === 'ArrowUp') {
event.preventDefault();
this.moveActiveIndex(key === 'ArrowDown' ? 1 : -1);
}
if (key === 'Enter' && this.activeIndex >= 0) {
event.preventDefault();
const item = this.visibleItems[this.activeIndex];
if (item && !item.disabled) {
this.selectItem(item.value);
}
}
if (key === 'Escape') {
event.preventDefault();
this.closeDropdown();
}
}

private handleSearchInput(event: Event) {
const input = event.target as HTMLInputElement;
this.searchQuery = input.value;
this.setActiveIndexFromValue();
}

private handleFocus() {
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}

private handleBlur() {
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}

private handleItemClick(item: ParsedItem) {
if (item.disabled) return;
this.selectItem(item.value);
}

private handleItemMouseEnter(index: number) {
this.activeIndex = index;
}
// ===========================================================================
// INTERNAL HELPERS
// ===========================================================================
private openDropdown() {
if (this.disabled || this.readonly || this.loading) return;
if (!this.isOpen) {
this.isOpen = true;
this.setActiveIndexFromValue();
}
}

private closeDropdown() {
this.isOpen = false;
this.activeIndex = -1;
}

private selectItem(value: string) {
if (this.disabled || this.readonly) return;
this.value = value;
this.isOpen = false;
this.searchQuery = '';
this.activeIndex = -1;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}

private setActiveIndexFromValue() {
const items = this.computeVisibleItems();
this.visibleItems = items;
const idx = items.findIndex(item => item.value === this.value);
this.activeIndex = idx >= 0 ? idx : (items.length > 0 ? 0 : -1);
}

private moveActiveIndex(direction: number) {
const items = this.visibleItems.length ? this.visibleItems : this.computeVisibleItems();
if (!items.length) return;
let index = this.activeIndex;
let safety = 0;
while (safety < items.length) {
index = (index + direction + items.length) % items.length;
if (!items[index].disabled) {
this.activeIndex = index;
return;
}
safety += 1;
}
}

private computeVisibleItems(): ParsedItem[] {
const allGroups = this.getSlots('Group').map(group => {
const label = group.getAttribute('label') || '';
const items = Array.from(group.querySelectorAll('Item')).map(el => ({
value: el.getAttribute('value') || '',
label: el.innerHTML,
disabled: el.hasAttribute('disabled'),
}));
return { label, items } as ParsedGroup;
});
const directItems = this.getSlots('Item')
.filter(el => !el.closest('Group'))
.map(el => ({
value: el.getAttribute('value') || '',
label: el.innerHTML,
disabled: el.hasAttribute('disabled'),
}));
const query = this.searchable ? this.searchQuery.trim().toLowerCase() : '';
const matches = (label: string) => !query || label.toLowerCase().includes(query);
const filteredGroups = allGroups.map(group => ({
...group,
items: group.items.filter(item => matches(item.label)),
})).filter(group => group.items.length > 0);
const filteredDirectItems = directItems.filter(item => matches(item.label));
return [...filteredGroups.flatMap(group => group.items), ...filteredDirectItems];
}

private getTriggerClasses(hasError: boolean): string {
return [
'w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
'placeholder:text-slate-400 dark:placeholder:text-slate-500',
hasError
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
this.isOpen
? 'ring-2 ring-sky-500 dark:ring-sky-400'
: 'hover:bg-slate-50 dark:hover:bg-slate-800',
this.disabled ? 'opacity-50 cursor-not-allowed' : '',
this.readonly ? 'cursor-default' : '',
].filter(Boolean).join(' ');
}

private getPanelClasses(): string {
return [
'absolute z-10 mt-1 w-full rounded-lg border shadow-lg',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
].join(' ');
}

private getItemClasses(item: ParsedItem, isSelected: boolean, isActive: boolean): string {
return [
'w-full rounded-md px-3 py-2 text-sm transition border',
isSelected
? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400'
: 'text-slate-900 dark:text-slate-100 border-transparent',
!item.disabled && !isSelected
? 'hover:bg-slate-50 dark:hover:bg-slate-700'
: '',
item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
isActive && !item.disabled ? 'ring-2 ring-sky-500 dark:ring-sky-400' : '',
].filter(Boolean).join(' ');
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const allItems = this.getSlots('Item').map(el => ({
value: el.getAttribute('value') || '',
label: el.innerHTML,
disabled: el.hasAttribute('disabled'),
}));
const groups = this.getSlots('Group').map(group => ({
label: group.getAttribute('label') || '',
items: Array.from(group.querySelectorAll('Item')).map(el => ({
value: el.getAttribute('value') || '',
label: el.innerHTML,
disabled: el.hasAttribute('disabled'),
})),
}));
const directItems = this.getSlots('Item').filter(el => !el.closest('Group')).map(el => ({
value: el.getAttribute('value') || '',
label: el.innerHTML,
disabled: el.hasAttribute('disabled'),
}));
const selectedLabel = allItems.find(item => item.value === this.value)?.label || null;

const requiredError = this.required && !this.value && !this.error;
const errorMessage = this.error || (requiredError ? this.msg.required : '');
const hasError = Boolean(errorMessage);

const hasLabel = this.hasSlot('Label');
const hasHelper = this.hasSlot('Helper');
const hasTrigger = this.hasSlot('Trigger');
const labelText = hasLabel ? this.getSlotContent('Label') : '';

const triggerContent = selectedLabel
? unsafeHTML(selectedLabel)
: hasTrigger
? unsafeHTML(this.getSlotContent('Trigger'))
: (this.placeholder || this.msg.placeholder || this.msg.viewEmpty);

const viewContent = selectedLabel
? unsafeHTML(selectedLabel)
: hasTrigger
? unsafeHTML(this.getSlotContent('Trigger'))
: (this.placeholder || this.msg.viewEmpty);

if (!this.isEditing) {
return html`
<div class="w-full">
${hasLabel
? html`<label id=${this.labelId} class="mb-1 block text-sm text-slate-600 dark:text-slate-400">${unsafeHTML(labelText)}</label>`
: nothing}
<div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
${typeof viewContent === 'string' ? viewContent : viewContent}
</div>
</div>
`;
}

const query = this.searchable ? this.searchQuery.trim().toLowerCase() : '';
const matches = (label: string) => !query || label.toLowerCase().includes(query);
const filteredGroups = groups.map(group => ({
...group,
items: group.items.filter(item => matches(item.label)),
})).filter(group => group.items.length > 0);
const filteredDirectItems = directItems.filter(item => matches(item.label));
this.visibleItems = [...filteredGroups.flatMap(group => group.items), ...filteredDirectItems];
let runningIndex = -1;

return html`
<div class="relative w-full">
${hasLabel
? html`<label id=${this.labelId} class="mb-1 block text-sm text-slate-600 dark:text-slate-400">${unsafeHTML(labelText)}</label>`
: nothing}

${this.name
? html`<input type="hidden" name=${ifDefined(this.name || undefined)} .value=${this.value ?? ''} />`
: nothing}

<button
class=${this.getTriggerClasses(hasError)}
type="button"
role="combobox"
aria-haspopup="listbox"
aria-expanded=${this.isOpen ? 'true' : 'false'}
aria-labelledby=${ifDefined(hasLabel ? this.labelId : undefined)}
aria-describedby=${ifDefined(hasError ? this.errorId : hasHelper ? this.helperId : undefined)}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
?disabled=${this.disabled}
@click=${this.handleTriggerClick}
@keydown=${this.handleTriggerKeyDown}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
>
<span class="truncate">
${this.loading
? html`<span class="text-slate-500 dark:text-slate-400">${this.msg.loading}</span>`
: typeof triggerContent === 'string'
? triggerContent
: triggerContent}
</span>
<span class="text-slate-500 dark:text-slate-400">▾</span>
</button>

${this.isOpen
? html`
<div class=${this.getPanelClasses()} role="listbox" @keydown=${this.handlePanelKeyDown}>
<div class="p-2">
${this.searchable
? html`
<input
class="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
type="text"
placeholder=${this.msg.searchPlaceholder}
.value=${this.searchQuery}
@input=${this.handleSearchInput}
/>
`
: nothing}
</div>
<div class="max-h-60 overflow-auto px-2 pb-2">
${filteredGroups.length > 0
? html`${filteredGroups.map(group => html`
<div class="py-2">
<div class="px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">${group.label}</div>
<div class="mt-1 space-y-1">
${group.items.map(item => {
runningIndex += 1;
const index = runningIndex;
const isSelected = item.value === this.value;
const isActive = index === this.activeIndex;
return html`
<div
class=${this.getItemClasses(item, isSelected, isActive)}
role="option"
aria-selected=${isSelected ? 'true' : 'false'}
aria-disabled=${item.disabled ? 'true' : 'false'}
@click=${() => this.handleItemClick(item)}
@mouseenter=${() => this.handleItemMouseEnter(index)}
>
${unsafeHTML(item.label)}
</div>
`;
})}
</div>
</div>
`)}
${filteredDirectItems.length > 0
? html`<div class="space-y-1">
${filteredDirectItems.map(item => {
runningIndex += 1;
const index = runningIndex;
const isSelected = item.value === this.value;
const isActive = index === this.activeIndex;
return html`
<div
class=${this.getItemClasses(item, isSelected, isActive)}
role="option"
aria-selected=${isSelected ? 'true' : 'false'}
aria-disabled=${item.disabled ? 'true' : 'false'}
@click=${() => this.handleItemClick(item)}
@mouseenter=${() => this.handleItemMouseEnter(index)}
>
${unsafeHTML(item.label)}
</div>
`;
})}
</div>`
: nothing}
${this.visibleItems.length === 0
? html`<div class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.noResults}
</div>`
: nothing}
</div>
</div>
`
: nothing}

${hasError
? html`<p id=${this.errorId} class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(String(errorMessage))}</p>`
: hasHelper
? html`<p id=${this.helperId} class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`
: nothing}
</div>
`;
}
}
