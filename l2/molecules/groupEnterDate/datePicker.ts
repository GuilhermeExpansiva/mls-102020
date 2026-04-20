/// <mls fileReference="_102020_/l2/molecules/groupEnterDate/datePicker.ts" enhancement="_102020_/l2/enhancementAura" />
// =============================================================================
// DATE PICKER MOLECULE
// =============================================================================
// Skill Group: enter + date (groupEnterDate)
// This molecule is presentation-only and does NOT contain business logic.
// - No Shadow DOM
// - Receives data via properties
// - Emits events upward
// =============================================================================
import { html, nothing, TemplateResult, unsafeHTML } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select a date',
  clear: 'Clear',
  loading: 'Loading...',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  week: 'Wk',
  emptyValue: '—',
  invalidDate: 'Invalid date',
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdaysShortSundayFirst: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma data',
    clear: 'Limpar',
    loading: 'Carregando...',
    prevMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    week: 'Sem',
    emptyValue: '—',
    invalidDate: 'Data inválida',
    months: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    weekdaysShortSundayFirst: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-enter-date--date-picker-102020')
export class DatePickerMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null; // ISO: YYYY-MM-DD

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: String })
  minDate: string = '';

  @propertyDataSource({ type: String })
  maxDate: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Number })
  firstDayOfWeek: number = 0; // 0=Sunday, 1=Monday

  @propertyDataSource({ type: Boolean })
  showWeekNumbers: boolean = false;

  @propertyDataSource({ type: Boolean })
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
  // ===========================================================================
  @state()
  private isOpen: boolean = false;

  @state()
  private viewMonth: number = new Date().getMonth(); // 0-11

  @state()
  private viewYear: number = new Date().getFullYear();

  // Derived (display) value: the trigger text
  @state()
  private displayValue: string = '';

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated(): void {
    this.syncViewToValueOrToday();
    this.displayValue = this.formatValueForDisplay(this.value);
  }

  // ===========================================================================
  // STATE CHANGE HANDLER (derived state)
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    const localeAttr = this.getAttribute('locale');
    if (valueAttr === `{{${key}}}` || localeAttr === `{{${key}}}`) {
      this.displayValue = this.formatValueForDisplay(this.value);
      this.syncViewToValueOrToday();
    }

    const minAttr = this.getAttribute('minDate');
    const maxAttr = this.getAttribute('maxDate');
    if (minAttr === `{{${key}}}` || maxAttr === `{{${key}}}`) {
      // Ensure current view remains navigable with new constraints
      this.clampViewToAllowedRange();
    }

    const loadingAttr = this.getAttribute('loading');
    if (loadingAttr === `{{${key}}}` && Boolean(value)) {
      // If became loading, close calendar.
      this.isOpen = false;
    }

    this.requestUpdate();
  }

  // ===========================================================================
  // EVENTS
  // ===========================================================================
  private emitChange(next: string | null): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      }),
    );
  }

  private emitMonthChange(year: number, month: number): void {
    this.dispatchEvent(
      new CustomEvent('monthChange', {
        bubbles: true,
        composed: true,
        detail: { year, month },
      }),
    );
  }

  private emitBlur(): void {
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  private emitFocus(): void {
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  // ===========================================================================
  // HELPERS — Dates
  // ===========================================================================
  private getEffectiveLocale(): string {
    // Prefer passed locale; fallback to document; then to 'en'
    const docLang = (document?.documentElement?.lang || '').trim();
    const raw = (this.locale || docLang || 'en').trim();
    return raw || 'en';
  }

  private pad2(n: number): string {
    return String(n).padStart(2, '0');
  }

  private isIsoDate(value: string): boolean {
    // YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const d = this.isoToDate(value);
    if (!d) return false;
    return this.dateToIso(d) === value;
  }

  private isoToDate(iso: string): Date | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const [y, m, d] = iso.split('-').map(n => parseInt(n, 10));
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
    // Local date with no time semantics.
    return dt;
  }

  private dateToIso(dt: Date): string {
    const y = dt.getFullYear();
    const m = this.pad2(dt.getMonth() + 1);
    const d = this.pad2(dt.getDate());
    return `${y}-${m}-${d}`;
  }

  private compareIso(a: string, b: string): number {
    // Lexicographic works for ISO date (YYYY-MM-DD)
    return a.localeCompare(b);
  }

  private isWithinRange(iso: string): boolean {
    if (!this.isIsoDate(iso)) return false;
    if (this.minDate && this.isIsoDate(this.minDate) && this.compareIso(iso, this.minDate) < 0) return false;
    if (this.maxDate && this.isIsoDate(this.maxDate) && this.compareIso(iso, this.maxDate) > 0) return false;
    return true;
  }

  private clampIsoToRange(iso: string): string {
    let next = iso;
    if (this.minDate && this.isIsoDate(this.minDate) && this.compareIso(next, this.minDate) < 0) next = this.minDate;
    if (this.maxDate && this.isIsoDate(this.maxDate) && this.compareIso(next, this.maxDate) > 0) next = this.maxDate;
    return next;
  }

  private formatValueForDisplay(value: string | null): string {
    if (!value) return '';
    if (!this.isIsoDate(value)) return this.msg.invalidDate;
    const d = this.isoToDate(value);
    if (!d) return this.msg.invalidDate;
    const locale = this.getEffectiveLocale();

    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    } catch {
      // Fallback: YYYY-MM-DD
      return value;
    }
  }

  private getMonthLabel(year: number, month: number): string {
    // month: 0-11
    const d = new Date(year, month, 1);
    const locale = this.getEffectiveLocale();
    try {
      // Prefer Intl month names (localized)
      const label = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d);
      return label;
    } catch {
      return `${this.msg.months[month]} ${year}`;
    }
  }

  private getWeekdayHeaders(): string[] {
    const base = this.msg.weekdaysShortSundayFirst;
    const shift = ((Number(this.firstDayOfWeek) || 0) % 7 + 7) % 7;
    return base.slice(shift).concat(base.slice(0, shift));
  }

  private getGridStartDate(year: number, month: number): Date {
    // Start at first of month, then backtrack to firstDayOfWeek
    const first = new Date(year, month, 1);
    const shift = ((Number(this.firstDayOfWeek) || 0) % 7 + 7) % 7;
    const weekday = first.getDay(); // 0=Sun
    const delta = (weekday - shift + 7) % 7;
    const start = new Date(year, month, 1 - delta);
    return start;
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private getMonthKey(year: number, month: number): string {
    return `${year}-${this.pad2(month + 1)}`;
  }

  private getMinMonthKey(): string | null {
    if (!this.minDate || !this.isIsoDate(this.minDate)) return null;
    const [y, m] = this.minDate.split('-');
    return `${y}-${m}`;
  }

  private getMaxMonthKey(): string | null {
    if (!this.maxDate || !this.isIsoDate(this.maxDate)) return null;
    const [y, m] = this.maxDate.split('-');
    return `${y}-${m}`;
  }

  private canNavigateTo(year: number, month: number): boolean {
    const key = this.getMonthKey(year, month);
    const minKey = this.getMinMonthKey();
    const maxKey = this.getMaxMonthKey();
    if (minKey && key < minKey) return false;
    if (maxKey && key > maxKey) return false;
    return true;
  }

  private clampViewToAllowedRange(): void {
    if (this.canNavigateTo(this.viewYear, this.viewMonth)) return;

    const minKey = this.getMinMonthKey();
    const maxKey = this.getMaxMonthKey();
    if (minKey && this.getMonthKey(this.viewYear, this.viewMonth) < minKey) {
      const [y, m] = minKey.split('-');
      this.viewYear = parseInt(y, 10);
      this.viewMonth = parseInt(m, 10) - 1;
      return;
    }
    if (maxKey && this.getMonthKey(this.viewYear, this.viewMonth) > maxKey) {
      const [y, m] = maxKey.split('-');
      this.viewYear = parseInt(y, 10);
      this.viewMonth = parseInt(m, 10) - 1;
    }
  }

  private syncViewToValueOrToday(): void {
    const base = this.value && this.isIsoDate(this.value) ? this.isoToDate(this.value) : new Date();
    const dt = base || new Date();
    this.viewYear = dt.getFullYear();
    this.viewMonth = dt.getMonth();
    this.clampViewToAllowedRange();
  }

  private getTodayIso(): string {
    return this.dateToIso(new Date());
  }

  private getCellIso(dt: Date): string {
    return this.dateToIso(dt);
  }

  private getWeekNumberIso(date: Date): number {
    // ISO week number, based on local date values.
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // Thursday in current week decides the year.
    const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
    d.setDate(d.getDate() - day + 3);
    const firstThursday = new Date(d.getFullYear(), 0, 4);
    const firstDay = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() - firstDay + 3);
    const diff = d.getTime() - firstThursday.getTime();
    return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
  }

  // ===========================================================================
  // INTERACTIONS
  // ===========================================================================
  private handleToggleOpen(): void {
    if (!this.isEditing) return;
    if (this.disabled || this.readonly) return;
    if (this.loading) return;

    if (!this.isOpen) {
      this.syncViewToValueOrToday();
    }
    this.isOpen = !this.isOpen;
  }

  private handleClose(): void {
    this.isOpen = false;
  }

  private handleDocumentPointerDown = (ev: PointerEvent): void => {
    if (!this.isOpen) return;
    const path = ev.composedPath() as EventTarget[];
    const clickedInside = path.includes(this);
    if (!clickedInside) this.handleClose();
  };

  private handleKeyDown = (ev: KeyboardEvent): void => {
    if (!this.isOpen) return;
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.handleClose();
    }
  };

  private handleOpenStateEffects(): void {
    // Attach/detach document listeners when open changes.
    // Called from render via a microtask to avoid repeated binding in render.
    queueMicrotask(() => {
      if (this.isOpen) {
        document.addEventListener('pointerdown', this.handleDocumentPointerDown, true);
        document.addEventListener('keydown', this.handleKeyDown, true);
      } else {
        document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
        document.removeEventListener('keydown', this.handleKeyDown, true);
      }
    });
  }

  private handleSelectDay(iso: string): void {
    if (this.disabled || this.readonly) return;
    if (this.loading) return;
    if (!this.isWithinRange(iso)) return;

    this.value = iso;
    this.displayValue = this.formatValueForDisplay(this.value);
    this.isOpen = false;
    this.emitChange(this.value);
  }

  private handleClear(): void {
    if (this.disabled || this.readonly) return;
    if (this.loading) return;

    this.value = null;
    this.displayValue = '';
    this.isOpen = false;
    this.emitChange(null);
  }

  private handlePrevMonth(): void {
    const nextMonth = this.viewMonth - 1;
    const year = nextMonth < 0 ? this.viewYear - 1 : this.viewYear;
    const month = (nextMonth + 12) % 12;
    if (!this.canNavigateTo(year, month)) return;

    this.viewYear = year;
    this.viewMonth = month;
    this.emitMonthChange(year, month);
  }

  private handleNextMonth(): void {
    const nextMonth = this.viewMonth + 1;
    const year = nextMonth > 11 ? this.viewYear + 1 : this.viewYear;
    const month = nextMonth % 12;
    if (!this.canNavigateTo(year, month)) return;

    this.viewYear = year;
    this.viewMonth = month;
    this.emitMonthChange(year, month);
  }

  private handleTriggerBlur = (): void => {
    // When clicking inside calendar, blur can happen; close is handled by outside click.
    this.emitBlur();
  };

  private handleTriggerFocus = (): void => {
    this.emitFocus();
  };

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(labelId: string): TemplateResult {
    if (!this.hasSlot('Label')) return html`${nothing}`;

    const requiredMark = this.required ? html`<span class="text-rose-600"> *</span>` : nothing;
    return html`
      <div class="mb-1">
        <div id=${labelId} class="text-sm font-medium text-slate-900">
          ${unsafeHTML(this.getSlotContent('Label'))}${requiredMark}
        </div>
      </div>
    `;
  }

  private renderHelperOrError(helperId: string): TemplateResult {
    if (!this.isEditing) return html`${nothing}`;

    if (this.error && String(this.error).trim() !== '') {
      return html`
        <div id=${helperId} class="mt-1 text-sm text-rose-700">${this.error}</div>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <div id=${helperId} class="mt-1 text-sm text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>
      `;
    }

    return html`${nothing}`;
  }

  private getTriggerClasses(): string {
    const hasError = this.isEditing && !!(this.error && String(this.error).trim() !== '');
    return [
      'w-full flex items-center justify-between gap-3',
      'rounded-md border px-3 py-2 text-sm',
      'bg-white text-slate-900',
      'transition',
      this.disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:bg-slate-50',
      this.readonly ? 'select-text' : '',
      hasError ? 'border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300' : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300',
      this.isOpen ? (hasError ? 'ring-2 ring-rose-300' : 'ring-2 ring-sky-300') : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getIconClasses(): string {
    return ['h-5 w-5 text-slate-500', this.disabled ? 'text-slate-400' : ''].filter(Boolean).join(' ');
  }

  private renderCalendarIcon(): TemplateResult {
    // Inline SVG to avoid external dependencies
    return html`
      <svg class=${this.getIconClasses()} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 2v2M17 2v2M3.5 9h17M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="mt-2 text-sm text-slate-500">${this.msg.loading}</div>
    `;
  }

  private renderCalendarPanel(): TemplateResult {
    if (!this.isOpen || this.loading) return html`${nothing}`;

    this.handleOpenStateEffects();

    const monthLabel = this.getMonthLabel(this.viewYear, this.viewMonth);
    const weekdayHeaders = this.getWeekdayHeaders();

    const canPrev = this.canNavigateTo(this.viewYear, this.viewMonth - 1 < 0 ? 11 : this.viewMonth - 1)
      ? this.canNavigateTo(this.viewMonth - 1 < 0 ? this.viewYear - 1 : this.viewYear, (this.viewMonth + 11) % 12)
      : false;

    const canNext = this.canNavigateTo(this.viewYear, this.viewMonth + 1 > 11 ? 0 : this.viewMonth + 1)
      ? this.canNavigateTo(this.viewMonth + 1 > 11 ? this.viewYear + 1 : this.viewYear, (this.viewMonth + 1) % 12)
      : false;

    const start = this.getGridStartDate(this.viewYear, this.viewMonth);
    const todayIso = this.getTodayIso();
    const selectedIso = this.value && this.isIsoDate(this.value) ? this.value : null;

    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      cells.push(d);
    }

    const headerColClasses = 'text-xs font-medium text-slate-500 px-2 py-1';

    return html`
      <div
        class="absolute z-50 mt-2 w-full max-w-sm rounded-lg border border-slate-200 bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-between px-3 py-2 border-b border-slate-100">
          <button
            type="button"
            class=${[
              'inline-flex items-center justify-center rounded-md px-2 py-1 text-sm',
              canPrev ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed',
            ].join(' ')}
            ?disabled=${!canPrev}
            aria-label=${this.msg.prevMonth}
            @click=${this.handlePrevMonth}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div class="text-sm font-semibold text-slate-900" aria-live="polite">${monthLabel}</div>

          <button
            type="button"
            class=${[
              'inline-flex items-center justify-center rounded-md px-2 py-1 text-sm',
              canNext ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed',
            ].join(' ')}
            ?disabled=${!canNext}
            aria-label=${this.msg.nextMonth}
            @click=${this.handleNextMonth}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div class="px-3 py-2">
          <div class="grid" style=${this.showWeekNumbers ? 'grid-template-columns: 2.5rem repeat(7, minmax(0, 1fr));' : 'grid-template-columns: repeat(7, minmax(0, 1fr));'}>
            ${this.showWeekNumbers
              ? html`<div class=${headerColClasses}>${this.msg.week}</div>`
              : nothing}
            ${weekdayHeaders.map(w => html`<div class=${headerColClasses}>${w}</div>`)}

            ${cells.map((d, idx) => {
              const iso = this.getCellIso(d);
              const inMonth = d.getMonth() === this.viewMonth;
              const isToday = iso === todayIso;
              const isSelected = selectedIso === iso;
              const disabledByRange = !this.isWithinRange(iso);

              const isDisabledCell = disabledByRange || this.disabled || this.readonly;

              const cellClasses = [
                'mx-1 my-1 rounded-md px-2 py-2 text-sm text-center',
                'transition select-none',
                inMonth ? 'text-slate-900' : 'text-slate-400',
                isDisabledCell ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100',
                isSelected ? 'bg-sky-600 text-white hover:bg-sky-600' : '',
                !isSelected && isToday ? 'border border-sky-400' : '',
                isDisabledCell && isSelected ? 'opacity-80' : '',
                'focus:outline-none focus:ring-2 focus:ring-sky-300',
              ]
                .filter(Boolean)
                .join(' ');

              const showWeekCell = this.showWeekNumbers && idx % 7 === 0;
              const weekNo = showWeekCell ? this.getWeekNumberIso(d) : null;

              const dayBtn = html`
                <button
                  type="button"
                  class=${cellClasses}
                  role="gridcell"
                  aria-selected=${isSelected ? 'true' : 'false'}
                  aria-disabled=${isDisabledCell ? 'true' : 'false'}
                  ?disabled=${isDisabledCell}
                  @click=${() => this.handleSelectDay(iso)}
                >
                  ${d.getDate()}
                </button>
              `;

              return html`
                ${showWeekCell
                  ? html`<div class="mx-1 my-1 rounded-md px-2 py-2 text-xs text-slate-500 text-center">${weekNo}</div>`
                  : nothing}
                ${dayBtn}
              `;
            })}
          </div>

          <div class="mt-2 flex items-center justify-between">
            <button
              type="button"
              class=${[
                'text-sm px-2 py-1 rounded-md',
                this.disabled || this.readonly ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')}
              ?disabled=${this.disabled || this.readonly}
              @click=${this.handleClear}
            >
              ${this.msg.clear}
            </button>

            <div class="text-xs text-slate-500">
              ${this.minDate && this.isIsoDate(this.minDate) ? html`<span>min ${this.minDate}</span>` : nothing}
              ${this.maxDate && this.isIsoDate(this.maxDate) ? html`<span class="ml-2">max ${this.maxDate}</span>` : nothing}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderViewMode(labelId: string): TemplateResult {
    const display = this.value ? this.formatValueForDisplay(this.value) : this.msg.emptyValue;

    return html`
      <div class="w-full">
        ${this.renderLabel(labelId)}
        <div class="text-sm text-slate-900">${display}</div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang] || messages.en;

    const labelId = `dp-label-${this.id || 'x'}`;
    const helperId = `dp-help-${this.id || 'x'}`;

    // View mode
    if (!this.isEditing) {
      // Ensure no global listeners remain
      if (this.isOpen) this.isOpen = false;
      this.handleOpenStateEffects();
      return this.renderViewMode(labelId);
    }

    const hasError = !!(this.error && String(this.error).trim() !== '');
    const placeholder = this.placeholder || this.msg.placeholder;
    const triggerText = this.value ? this.formatValueForDisplay(this.value) : (this.displayValue || '');
    const display = this.value ? triggerText : placeholder;

    const describedBy = hasError || this.hasSlot('Helper') ? helperId : undefined;

    const triggerTextClasses = [
      'flex-1 min-w-0 text-left',
      this.value ? 'text-slate-900' : 'text-slate-500',
    ].join(' ');

    // If open and constraints changed, keep view clamped
    this.clampViewToAllowedRange();

    // Close calendar while loading
    if (this.loading && this.isOpen) this.isOpen = false;

    // Manage listeners based on open state
    this.handleOpenStateEffects();

    return html`
      <div class="w-full relative">
        ${this.renderLabel(labelId)}

        <button
          type="button"
          class=${this.getTriggerClasses()}
          @click=${this.handleToggleOpen}
          @blur=${this.handleTriggerBlur}
          @focus=${this.handleTriggerFocus}
          aria-labelledby=${labelId}
          aria-describedby=${describedBy}
          aria-invalid=${hasError ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          ?disabled=${this.disabled}
        >
          <span class=${triggerTextClasses}>${display}</span>
          ${this.renderCalendarIcon()}
        </button>

        ${this.loading ? this.renderLoading() : nothing}
        ${this.renderCalendarPanel()}

        ${this.renderHelperOrError(helperId)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'group-enter-date--date-picker-102020': DatePickerMolecule;
  }
}
