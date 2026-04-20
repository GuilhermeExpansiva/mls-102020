/// <mls fileReference="_102020_/l2/molecules/groupEnterDateTimeInterval/meetingDateTimeInterval.ts" enhancement="_102020_/l2/enhancementAura" />
// =============================================================================
// MEETING DATE TIME INTERVAL MOLECULE
// =============================================================================
// Skill Group: enter + datetime-interval
// This molecule is presentation-only (no business logic, no backend, no global state).
// =============================================================================

import { html, nothing, TemplateResult, unsafeHTML } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  labelStartFallback: 'Start',
  labelEndFallback: 'End',
  placeholderStart: 'Select start',
  placeholderEnd: 'Select end',
  viewDash: '—',
  invalidDate: 'Invalid date',
  clear: 'Clear',
  confirm: 'Confirm',
  loading: 'Loading...',
  startPickerTitle: 'Start date & time',
  endPickerTitle: 'End date & time',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    labelStartFallback: 'Início',
    labelEndFallback: 'Fim',
    placeholderStart: 'Selecionar início',
    placeholderEnd: 'Selecionar fim',
    viewDash: '—',
    invalidDate: 'Data inválida',
    clear: 'Limpar',
    confirm: 'Confirmar',
    loading: 'Carregando...',
    startPickerTitle: 'Data e hora de início',
    endPickerTitle: 'Data e hora de término',
  },
};
/// **collab_i18n_end**

type ActiveField = 'start' | 'end' | null;

type ParsedIso = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  second: number; // 0-59
};

@customElement('molecules--group-enter-date-time-interval--meeting-date-time-interval-102020')
export class MeetingDateTimeIntervalMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

  // ===========================================================================
  // PROPERTIES — Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  startDatetime: string | null = null;

  @propertyDataSource({ type: String })
  endDatetime: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: String })
  timezone: string = '';

  @propertyDataSource({ type: String })
  minDatetime: string = '';

  @propertyDataSource({ type: String })
  maxDatetime: string = '';

  @propertyDataSource({ type: Number })
  minDurationMinutes: number = 0;

  @propertyDataSource({ type: Number })
  maxDurationMinutes: number = 0;

  @propertyDataSource({ type: Number })
  minuteStep: number = 1;

  @propertyDataSource({ type: Boolean })
  allowSameInstant: boolean = false;

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
  private activeField: ActiveField = null;

  @state()
  private draftStartValue: string = '';

  @state()
  private draftEndValue: string = '';

  // ===========================================================================
  // STATE CHANGE HANDLER
  // Ensures draft values keep in sync when bound states change externally.
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const startAttr = this.getAttribute('startDatetime');
    const endAttr = this.getAttribute('endDatetime');

    if (startAttr === `{{${key}}}`) {
      this.draftStartValue = this.isoToInputValue(value);
      if (this.activeField === 'start' && this.draftStartValue === '' && value) {
        this.draftStartValue = this.isoToInputValue(value);
      }
    }

    if (endAttr === `{{${key}}}`) {
      this.draftEndValue = this.isoToInputValue(value);
      if (this.activeField === 'end' && this.draftEndValue === '' && value) {
        this.draftEndValue = this.isoToInputValue(value);
      }
    }

    this.requestUpdate();
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    // Initialize drafts from incoming values (if any)
    this.draftStartValue = this.isoToInputValue(this.startDatetime);
    this.draftEndValue = this.isoToInputValue(this.endDatetime);
  }

  // ===========================================================================
  // EVENTS
  // ===========================================================================
  private emitFocus() {
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private emitBlur() {
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private emitStartChange(value: string | null) {
    this.dispatchEvent(
      new CustomEvent('startChange', {
        bubbles: true,
        composed: true,
        detail: { value },
      })
    );
  }

  private emitEndChange(value: string | null) {
    this.dispatchEvent(
      new CustomEvent('endChange', {
        bubbles: true,
        composed: true,
        detail: { value },
      })
    );
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          startDatetime: this.startDatetime,
          endDatetime: this.endDatetime,
        },
      })
    );
  }

  // ===========================================================================
  // HELPERS — parsing/formatting (presentation-only)
  // ===========================================================================
  private getEffectiveLocale(): string {
    return this.locale || (document?.documentElement?.lang || 'en');
  }

  private pad2(n: number): string {
    return String(n).padStart(2, '0');
  }

  private parseIsoLocalSeconds(iso: string | null | undefined): ParsedIso | null {
    if (!iso) return null;
    // Expected: YYYY-MM-DDTHH:mm:ss
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]{2}))?$/.exec(iso);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    const second = Number(m[6] ?? '00');
    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day) ||
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      Number.isNaN(second)
    ) {
      return null;
    }
    return { year, month, day, hour, minute, second };
  }

  private toIsoFromInputValue(inputValue: string): string | null {
    // input type datetime-local gives: YYYY-MM-DDTHH:mm
    if (!inputValue) return null;
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})$/.exec(inputValue);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const h = Number(m[4]);
    const mi = Number(m[5]);
    if ([y, mo, d, h, mi].some(v => Number.isNaN(v))) return null;
    return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00`;
  }

  private isoToInputValue(iso: string | null): string {
    const parsed = this.parseIsoLocalSeconds(iso);
    if (!parsed) return '';
    return `${parsed.year}-${this.pad2(parsed.month)}-${this.pad2(parsed.day)}T${this.pad2(parsed.hour)}:${this.pad2(parsed.minute)}`;
  }

  private compareIso(a: string, b: string): number {
    // Safe because fixed-width ISO local format is lexicographically sortable.
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  private isRangeValid(startIso: string | null, endIso: string | null): boolean {
    if (!startIso || !endIso) return true;
    const cmp = this.compareIso(endIso, startIso);
    if (cmp < 0) return false;
    if (cmp === 0 && !this.allowSameInstant) return false;
    return true;
  }

  private computeDurationMinutes(startIso: string, endIso: string): number {
    // Convert as local Date for duration only.
    // NOTE: timezone prop affects display only; duration is purely UI guidance.
    const s = new Date(startIso);
    const e = new Date(endIso);
    const diff = e.getTime() - s.getTime();
    return Math.floor(diff / 60000);
  }

  private isDurationValid(startIso: string | null, endIso: string | null): boolean {
    if (!startIso || !endIso) return true;
    if (!this.isRangeValid(startIso, endIso)) return false;
    const dur = this.computeDurationMinutes(startIso, endIso);
    if (this.minDurationMinutes > 0 && dur < this.minDurationMinutes) return false;
    if (this.maxDurationMinutes > 0 && dur > this.maxDurationMinutes) return false;
    return true;
  }

  private formatDateTimeForDisplay(iso: string | null): string {
    if (!iso) return '';
    const locale = this.getEffectiveLocale();

    // If timezone is set, format with it; otherwise local.
    try {
      const dt = new Date(iso);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      if (this.timezone) options.timeZone = this.timezone;

      return new Intl.DateTimeFormat(locale, options).format(dt);
    } catch {
      return this.msg.invalidDate;
    }
  }

  private formatTimeForDisplay(iso: string): string {
    const locale = this.getEffectiveLocale();
    try {
      const dt = new Date(iso);
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
      };
      if (this.timezone) options.timeZone = this.timezone;
      return new Intl.DateTimeFormat(locale, options).format(dt);
    } catch {
      return this.msg.invalidDate;
    }
  }

  private getDateKey(iso: string): string {
    // Extract YYYY-MM-DD (no timezone conversion) for "same day" heuristics.
    const m = /^([0-9]{4}-[0-9]{2}-[0-9]{2})T/.exec(iso);
    return m?.[1] || '';
  }

  private formatRangeForView(startIso: string | null, endIso: string | null): string {
    if (!startIso && !endIso) return this.msg.viewDash;
    if (startIso && !endIso) return `${this.formatDateTimeForDisplay(startIso)} – ${this.msg.viewDash}`;
    if (!startIso && endIso) return `${this.msg.viewDash} – ${this.formatDateTimeForDisplay(endIso)}`;

    const startKey = this.getDateKey(startIso!);
    const endKey = this.getDateKey(endIso!);
    if (startKey && endKey && startKey === endKey) {
      // Same day: show full start, then time only for end.
      return `${this.formatDateTimeForDisplay(startIso!)} – ${this.formatTimeForDisplay(endIso!)}`;
    }
    return `${this.formatDateTimeForDisplay(startIso!)} – ${this.formatDateTimeForDisplay(endIso!)}`;
  }

  private snapToMinuteStep(inputValue: string): string {
    if (!inputValue) return '';
    const m = /^([0-9]{4}-[0-9]{2}-[0-9]{2})T([0-9]{2}):([0-9]{2})$/.exec(inputValue);
    if (!m) return inputValue;
    const datePart = m[1];
    const hh = Number(m[2]);
    const mm = Number(m[3]);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return inputValue;

    const step = Math.max(1, Math.floor(this.minuteStep || 1));
    const snapped = Math.round(mm / step) * step;
    let newH = hh;
    let newM = snapped;

    if (newM >= 60) {
      newH = (newH + 1) % 24;
      newM = 0;
    }
    return `${datePart}T${this.pad2(newH)}:${this.pad2(newM)}`;
  }

  private getMinForStartInput(): string | undefined {
    const min = this.isoToInputValue(this.minDatetime || null);
    return min || undefined;
  }

  private getMaxForStartInput(): string | undefined {
    const max = this.isoToInputValue(this.maxDatetime || null);
    return max || undefined;
  }

  private getMinForEndInput(): string | undefined {
    // At minimum, end must be >= start (or > start).
    const baseMin = this.minDatetime ? this.isoToInputValue(this.minDatetime) : '';
    const startMin = this.startDatetime ? this.isoToInputValue(this.startDatetime) : '';

    const chosen = [baseMin, startMin].filter(Boolean).sort().pop() || '';
    return chosen || undefined;
  }

  private getMaxForEndInput(): string | undefined {
    const baseMax = this.isoToInputValue(this.maxDatetime || null);
    return baseMax || undefined;
  }

  // ===========================================================================
  // UI HANDLERS
  // ===========================================================================
  private canInteract(): boolean {
    return !this.disabled && !this.readonly && !this.loading;
  }

  private handleOpen(field: Exclude<ActiveField, null>) {
    if (!this.isEditing) return;
    if (!this.canInteract()) return;

    this.emitFocus();
    this.activeField = field;

    if (field === 'start') {
      this.draftStartValue = this.draftStartValue || this.isoToInputValue(this.startDatetime);
    } else {
      this.draftEndValue = this.draftEndValue || this.isoToInputValue(this.endDatetime);
    }
  }

  private handleClose() {
    this.activeField = null;
    this.emitBlur();
  }

  private handleDraftStartInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.draftStartValue = this.snapToMinuteStep(input.value);
  }

  private handleDraftEndInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.draftEndValue = this.snapToMinuteStep(input.value);
  }

  private handleClear(field: Exclude<ActiveField, null>) {
    if (!this.canInteract()) return;

    if (field === 'start') {
      this.startDatetime = null;
      this.draftStartValue = '';
      this.emitStartChange(null);
      // If start is cleared, end constraints are undefined; keep end as-is (UI choice).
    } else {
      this.endDatetime = null;
      this.draftEndValue = '';
      this.emitEndChange(null);
      this.emitChange();
    }

    this.handleClose();
  }

  private handleConfirm(field: Exclude<ActiveField, null>) {
    if (!this.canInteract()) return;

    if (field === 'start') {
      const iso = this.toIsoFromInputValue(this.draftStartValue);
      this.startDatetime = iso;
      this.emitStartChange(iso);

      if (!this.endDatetime) {
        // Auto-advance selection
        this.activeField = 'end';
        this.draftEndValue = this.draftEndValue || this.isoToInputValue(this.endDatetime);
        return;
      }

      this.handleClose();
      return;
    }

    // end
    const iso = this.toIsoFromInputValue(this.draftEndValue);
    // Enforce constraints visually: only confirm if valid.
    const okRange = this.isRangeValid(this.startDatetime, iso);
    const okDuration = this.isDurationValid(this.startDatetime, iso);
    if (!okRange || !okDuration) {
      // Do not commit; keep panel open.
      this.requestUpdate();
      return;
    }

    this.endDatetime = iso;
    this.emitEndChange(iso);
    this.emitChange();
    this.handleClose();
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html`${nothing}`;
    const content = this.getSlotContent('Label');
    return html`<div class="mb-1 text-sm font-medium text-slate-800">${unsafeHTML(content)}</div>`;
  }

  private renderHelperOrError(): TemplateResult {
    if (!this.isEditing) return html`${nothing}`;

    if (this.error) {
      return html`<div class="mt-1 text-xs text-rose-600" id="err">${this.error}</div>`;
    }

    if (this.hasSlot('Helper')) {
      const content = this.getSlotContent('Helper');
      return html`<div class="mt-1 text-xs text-slate-500" id="help">${unsafeHTML(content)}</div>`;
    }

    return html`${nothing}`;
  }

  private renderViewMode(): TemplateResult {
    return html`
      <div class="w-full">
        ${this.renderLabel()}
        <div class="text-sm text-slate-900">${this.formatRangeForView(this.startDatetime, this.endDatetime)}</div>
      </div>
    `;
  }

  private renderInputCard(field: 'start' | 'end'): TemplateResult {
    const isActive = this.activeField === field;
    const hasError = Boolean(this.error);
    const common = [
      'w-full rounded-lg border px-3 py-2 text-left text-sm transition',
      'flex items-center justify-between gap-3',
      'bg-white',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
      !this.disabled && !this.readonly ? 'hover:bg-slate-50' : '',
      isActive ? 'border-sky-500 ring-2 ring-sky-100' : '',
      hasError ? 'border-rose-500' : 'border-slate-200',
      this.readonly ? 'cursor-default' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');

    const labelTag = field === 'start' ? 'LabelStart' : 'LabelEnd';
    const labelFallback = field === 'start' ? this.msg.labelStartFallback : this.msg.labelEndFallback;
    const label = this.hasSlot(labelTag) ? this.getSlotContent(labelTag) : labelFallback;

    const valueIso = field === 'start' ? this.startDatetime : this.endDatetime;
    const placeholder = field === 'start' ? this.msg.placeholderStart : this.msg.placeholderEnd;
    const display = valueIso ? this.formatDateTimeForDisplay(valueIso) : '';

    const ariaInvalid = this.isEditing && this.error ? 'true' : 'false';
    const describedBy = this.error ? 'err' : this.hasSlot('Helper') ? 'help' : '';

    return html`
      <button
        type="button"
        class="${common}"
        ?disabled=${this.disabled}
        aria-invalid=${ariaInvalid}
        aria-required=${this.required ? 'true' : 'false'}
        aria-describedby=${describedBy}
        @click=${() => this.handleOpen(field)}
      >
        <span class="min-w-0 flex-1">
          <span class="block text-xs text-slate-500">${unsafeHTML(label)}</span>
          <span class="block truncate ${display ? 'text-slate-900' : 'text-slate-400'}">${display || placeholder}</span>
        </span>

        <span class="flex items-center gap-2 text-slate-400">
          <span class="inline-block h-5 w-5" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
            </svg>
          </span>
          <span class="inline-block h-5 w-5" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6v6l4 2" />
              <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
            </svg>
          </span>
        </span>
      </button>
    `;
  }

  private renderPickerPanel(field: 'start' | 'end'): TemplateResult {
    if (this.loading) return html`${nothing}`;
    if (this.activeField !== field) return html`${nothing}`;

    const title = field === 'start' ? this.msg.startPickerTitle : this.msg.endPickerTitle;

    const draftValue = field === 'start' ? this.draftStartValue : this.draftEndValue;
    const min = field === 'start' ? this.getMinForStartInput() : this.getMinForEndInput();
    const max = field === 'start' ? this.getMaxForStartInput() : this.getMaxForEndInput();

    const committedStart = this.startDatetime;
    const draftEndIso = field === 'end' ? this.toIsoFromInputValue(this.draftEndValue) : null;

    const endRangeOk = field === 'end' ? this.isRangeValid(committedStart, draftEndIso) : true;
    const endDurationOk = field === 'end' ? this.isDurationValid(committedStart, draftEndIso) : true;

    const confirmDisabled =
      !this.canInteract() ||
      !draftValue ||
      (field === 'end' && (!endRangeOk || !endDurationOk));

    const panelClasses = [
      'mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm',
    ].join(' ');

    const headerClasses = ['flex items-center justify-between gap-3'].join(' ');

    const btnBase = ['rounded-md px-3 py-2 text-sm border transition'].join(' ');
    const btnSecondary = [btnBase, 'border-slate-200 bg-white text-slate-700', !this.canInteract() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'].join(' ');
    const btnPrimary = [btnBase, 'border-sky-600 bg-sky-600 text-white', confirmDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700'].join(' ');

    const inputClasses = [
      'mt-3 w-full rounded-md border px-3 py-2 text-sm',
      this.error ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:outline-none' : 'border-slate-200 focus:ring-2 focus:ring-sky-200 focus:outline-none',
    ].join(' ');

    const warning =
      field === 'end' && draftValue && (!endRangeOk || !endDurationOk)
        ? html`<div class="mt-2 text-xs text-amber-700">
            ${!endRangeOk
              ? html`<div>End must be after start${this.allowSameInstant ? ' (or equal)' : ''}.</div>`
              : html`${nothing}`}
            ${endRangeOk && !endDurationOk
              ? html`<div>Duration is outside the allowed range.</div>`
              : html`${nothing}`}
          </div>`
        : html`${nothing}`;

    return html`
      <div class="${panelClasses}" role="dialog" aria-modal="true">
        <div class="${headerClasses}">
          <div class="text-sm font-medium text-slate-900">${title}</div>
          <button type="button" class="text-xs text-slate-500 hover:text-slate-700" @click=${this.handleClose}>✕</button>
        </div>

        <input
          class="${inputClasses}"
          type="datetime-local"
          .value=${draftValue}
          step=${String(Math.max(60, Math.floor((this.minuteStep || 1) * 60)))}
          ${min ? html`min=${min}` : html`${nothing}`}
          ${max ? html`max=${max}` : html`${nothing}`}
          ?disabled=${!this.canInteract()}
          @input=${field === 'start' ? this.handleDraftStartInput : this.handleDraftEndInput}
        />

        ${warning}

        <div class="mt-3 flex items-center justify-end gap-2">
          <button type="button" class="${btnSecondary}" ?disabled=${!this.canInteract()} @click=${() => this.handleClear(field)}>
            ${this.msg.clear}
          </button>
          <button type="button" class="${btnPrimary}" ?disabled=${confirmDisabled} @click=${() => this.handleConfirm(field)}>
            ${this.msg.confirm}
          </button>
        </div>
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    if (!this.loading) return html`${nothing}`;
    return html`
      <div class="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500"></span>
        <span>${this.msg.loading}</span>
      </div>
    `;
  }

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (!this.isEditing) {
      return this.renderViewMode();
    }

    const containerClasses = [
      'w-full',
      this.disabled ? 'opacity-60' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="${containerClasses}">
        ${this.renderLabel()}

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            ${this.renderInputCard('start')}
            ${this.renderPickerPanel('start')}
          </div>
          <div>
            ${this.renderInputCard('end')}
            ${this.renderPickerPanel('end')}
          </div>
        </div>

        ${this.renderLoading()}
        ${this.renderHelperOrError()}
      </div>
    `;
  }
}
