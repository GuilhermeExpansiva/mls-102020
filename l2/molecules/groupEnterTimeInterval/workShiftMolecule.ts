/// <mls fileReference="_102020_/l2/molecules/groupEnterTimeInterval/workShiftMolecule.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// WORK SHIFT MOLECULE (enter + time-interval)
// =============================================================================
// Skill Group: enter + time-interval
// This molecule is presentation-only and does NOT contain business logic.
// - No Shadow DOM
// - No backend calls
// - Receives data via properties
// - Emits UI events upward


import { html, nothing, TemplateResult, unsafeHTML } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  startPlaceholder: 'Start time',
  endPlaceholder: 'End time',
  rangeDash: '–',
  emptyRange: '—',
  nextDayShort: '(+1)',
  loading: 'Loading...',
  clear: 'Clear',
  confirm: 'Confirm',
  startLabelFallback: 'Start',
  endLabelFallback: 'End',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    startPlaceholder: 'Hora inicial',
    endPlaceholder: 'Hora final',
    rangeDash: '–',
    emptyRange: '—',
    nextDayShort: '(+1)',
    loading: 'Carregando...',
    clear: 'Limpar',
    confirm: 'Confirmar',
    startLabelFallback: 'Início',
    endLabelFallback: 'Fim',
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-enter-time-interval--work-shift-molecule-102020')
export class WorkShiftMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

  // ===========================================================================
  // PROPERTIES — From Contract (all via @propertyDataSource)
  // ===========================================================================
  // Data
  @propertyDataSource({ type: String })
  startTime: string | null = null;

  @propertyDataSource({ type: String })
  endTime: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  // Configuration
  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: Boolean })
  hour12: boolean = false;

  @propertyDataSource({ type: Boolean })
  showSeconds: boolean = false;

  @propertyDataSource({ type: Number })
  minuteStep: number = 1;

  @propertyDataSource({ type: String })
  minTime: string = '';

  @propertyDataSource({ type: String })
  maxTime: string = '';

  @propertyDataSource({ type: Number })
  minDurationMinutes: number = 0;

  @propertyDataSource({ type: Number })
  maxDurationMinutes: number = 0;

  @propertyDataSource({ type: Boolean })
  allowOvernight: boolean = false;

  @propertyDataSource({ type: Boolean })
  allowSameTime: boolean = false;

  // States
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
  private activeField: 'start' | 'end' | null = null;

  @state()
  private draftStart: string = '';

  @state()
  private draftEnd: string = '';

  // ===========================================================================
  // STATE CHANGE HANDLER (derived draft values)
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const startAttr = this.getAttribute('startTime');
    const endAttr = this.getAttribute('endTime');

    if (startAttr === `{{${key}}}`) {
      this.draftStart = this.coerceToTimeInput(value);
    }
    if (endAttr === `{{${key}}}`) {
      this.draftEnd = this.coerceToTimeInput(value);
    }

    this.requestUpdate();
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.draftStart = this.coerceToTimeInput(this.startTime);
    this.draftEnd = this.coerceToTimeInput(this.endTime);
  }

  // ===========================================================================
  // HELPERS — formatting/parsing/validation
  // ===========================================================================
  private getLang(): string {
    const lang = this.getMessageKey(messages);
    return messages[lang] ? lang : 'en';
  }

  private getEffectiveLocale(): string {
    return (this.locale && this.locale.trim()) || (typeof navigator !== 'undefined' ? navigator.language : 'en');
  }

  private normalizeTimeValue(value: string | null): string {
    if (!value) return '';
    const v = String(value).trim();
    // accept HH:mm or HH:mm:ss
    const m = v.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
    if (!m) return '';
    const hh = m[1];
    const mm = m[2];
    const ss = m[3] ?? '00';
    return this.showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  }

  private coerceToTimeInput(value: string | null): string {
    // For <input type="time"> value: HH:mm or HH:mm:ss
    return this.normalizeTimeValue(value);
  }

  private toMinutes(time: string): number {
    const m = time.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return NaN;
    const h = Number(m[1]);
    const min = Number(m[2]);
    return h * 60 + min;
  }

  private isOvernight(start: string | null, end: string | null): boolean {
    if (!this.allowOvernight) return false;
    if (!start || !end) return false;
    const s = this.normalizeTimeValue(start);
    const e = this.normalizeTimeValue(end);
    if (!s || !e) return false;
    return this.toMinutes(e) < this.toMinutes(s);
  }

  private formatForDisplay(value: string | null): string {
    const normalized = this.normalizeTimeValue(value);
    if (!normalized) return '';

    // Convert to locale display using Date with fixed UTC date
    // (no date stored/emitted; only for formatting)
    const parts = normalized.split(':');
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    const ss = Number(parts[2] ?? '0');

    const d = new Date(Date.UTC(2000, 0, 1, hh, mm, ss));
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: this.hour12,
    };

    if (this.showSeconds) {
      options.second = '2-digit';
    }

    try {
      return new Intl.DateTimeFormat(this.getEffectiveLocale(), options).format(d);
    } catch {
      return normalized;
    }
  }

  private formatRangeForView(): string {
    const start = this.formatForDisplay(this.startTime);
    const end = this.formatForDisplay(this.endTime);

    if (!start && !end) return this.msg.emptyRange;

    const dash = ` ${this.msg.rangeDash} `;
    const overnight = this.isOvernight(this.startTime, this.endTime);

    if (start && !end) return `${start}${dash}${this.msg.emptyRange}`;
    if (!start && end) return `${this.msg.emptyRange}${dash}${end}`;

    return `${start}${dash}${end}${overnight ? ` ${this.msg.nextDayShort}` : ''}`;
  }

  private isTimeWithinMinMax(time: string): boolean {
    const t = this.toMinutes(time);
    if (isNaN(t)) return false;

    if (this.minTime) {
      const min = this.toMinutes(this.normalizeTimeValue(this.minTime));
      if (!isNaN(min) && t < min) return false;
    }

    if (this.maxTime) {
      const max = this.toMinutes(this.normalizeTimeValue(this.maxTime));
      if (!isNaN(max) && t > max) return false;
    }

    return true;
  }

  private calcDurationMinutes(start: string, end: string): number {
    const s = this.toMinutes(start);
    const e = this.toMinutes(end);
    if (isNaN(s) || isNaN(e)) return NaN;

    if (this.allowOvernight && e < s) {
      return 24 * 60 - s + e;
    }

    return e - s;
  }

  private isEndValidAgainstStart(start: string, end: string): boolean {
    const sMin = this.toMinutes(start);
    const eMin = this.toMinutes(end);
    if (isNaN(sMin) || isNaN(eMin)) return false;

    if (!this.allowOvernight) {
      if (this.allowSameTime) {
        if (eMin < sMin) return false;
      } else {
        if (eMin <= sMin) return false;
      }
    } else {
      // Overnight allowed: any end time ok in relation to start,
      // but optionally block same-time if disallowed.
      if (!this.allowSameTime && eMin === sMin) return false;
    }

    const duration = this.calcDurationMinutes(start, end);
    if (isNaN(duration)) return false;

    if (this.minDurationMinutes > 0 && duration < this.minDurationMinutes) return false;
    if (this.maxDurationMinutes > 0 && duration > this.maxDurationMinutes) return false;

    return true;
  }

  private buildTimeOptions(): string[] {
    const step = Number(this.minuteStep);
    const minuteStep = !isFinite(step) || step <= 0 ? 1 : Math.min(60, Math.floor(step));

    const options: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += minuteStep) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const base = `${hh}:${mm}`;
        options.push(this.showSeconds ? `${base}:00` : base);
      }
    }

    return options;
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
          startTime: this.startTime,
          endTime: this.endTime,
        },
      })
    );
  }

  // ===========================================================================
  // UI HANDLERS
  // ===========================================================================
  private handleOpen(field: 'start' | 'end') {
    if (this.disabled || this.readonly) return;
    if (this.loading) return;

    this.activeField = this.activeField === field ? null : field;

    // Keep drafts in sync
    this.draftStart = this.coerceToTimeInput(this.startTime);
    this.draftEnd = this.coerceToTimeInput(this.endTime);

    if (this.activeField) this.emitFocus();
    if (!this.activeField) this.emitBlur();
  }

  private handleBackdropClick() {
    this.activeField = null;
    this.emitBlur();
  }

  private handleDraftInput(field: 'start' | 'end', e: Event) {
    const input = e.target as HTMLInputElement;
    if (field === 'start') this.draftStart = input.value;
    if (field === 'end') this.draftEnd = input.value;
  }

  private handleClear(field: 'start' | 'end') {
    if (this.disabled || this.readonly) return;

    if (field === 'start') {
      this.startTime = null;
      this.draftStart = '';
      this.emitStartChange(null);
      this.emitChange();
      // Keep end as-is; no business logic.
      return;
    }

    this.endTime = null;
    this.draftEnd = '';
    this.emitEndChange(null);
    this.emitChange();
  }

  private handleConfirm(field: 'start' | 'end') {
    if (this.disabled || this.readonly) return;

    if (field === 'start') {
      const normalized = this.normalizeTimeValue(this.draftStart) || null;

      // If value exists but outside min/max, ignore confirmation
      if (normalized && !this.isTimeWithinMinMax(normalized)) return;

      this.startTime = normalized;
      this.emitStartChange(normalized);

      if (!this.endTime) {
        this.activeField = 'end';
      } else {
        this.activeField = null;
        this.emitBlur();
      }

      // Do not emit 'change' here per contract (only both times confirmed).
      return;
    }

    const normalizedEnd = this.normalizeTimeValue(this.draftEnd) || null;

    if (normalizedEnd && !this.isTimeWithinMinMax(normalizedEnd)) return;

    // If we have a start, enforce end validity visual rule by blocking confirm
    // (presentation behavior; error state is controlled by parent).
    if (this.startTime && normalizedEnd) {
      const s = this.normalizeTimeValue(this.startTime);
      if (s && !this.isEndValidAgainstStart(s, normalizedEnd)) return;
    }

    this.endTime = normalizedEnd;
    this.emitEndChange(normalizedEnd);

    // Both times confirmed => change
    this.emitChange();

    this.activeField = null;
    this.emitBlur();
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html`${nothing}`;
    const content = this.getSlotContent('Label');
    return html`<div class="mb-1 text-sm font-medium text-slate-700">${unsafeHTML(content)}</div>`;
  }

  private renderHelperOrError(): TemplateResult {
    if (this.error && this.error.trim()) {
      return html`<div id="ws-error" class="mt-1 text-sm text-rose-600">${this.error}</div>`;
    }

    if (this.hasSlot('Helper')) {
      return html`<div class="mt-1 text-sm text-slate-500">${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
    }

    return html`${nothing}`;
  }

  private renderViewMode(): TemplateResult {
    const range = this.formatRangeForView();

    return html`
      <div class="w-full">
        ${this.renderLabel()}
        <div class="text-sm text-slate-800">${range}</div>
      </div>
    `;
  }

  private getContainerClasses(): string {
    const hasError = Boolean(this.error && this.error.trim());
    const disabled = this.disabled;
    const readonly = this.readonly;

    return [
      'w-full',
      'rounded-lg border',
      'p-3',
      'bg-white',
      'transition',
      hasError ? 'border-rose-500' : 'border-slate-200',
      this.activeField ? 'ring-2 ring-sky-500 ring-offset-1' : '',
      disabled ? 'opacity-60 cursor-not-allowed' : '',
      readonly ? 'bg-slate-50' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getFieldButtonClasses(isActive: boolean): string {
    const hasError = Boolean(this.error && this.error.trim());
    return [
      'w-full',
      'flex items-center justify-between',
      'rounded-md',
      'border',
      'px-3 py-2',
      'text-sm',
      'bg-white',
      'transition',
      hasError ? 'border-rose-500' : 'border-slate-200',
      isActive ? 'bg-sky-50 border-sky-500' : 'hover:bg-slate-50',
      this.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      this.readonly ? 'bg-slate-50 cursor-default' : '',
      'focus:outline-none focus:ring-2 focus:ring-sky-500',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private renderFieldHeader(field: 'start' | 'end'): TemplateResult {
    const slot = field === 'start' ? 'LabelStart' : 'LabelEnd';
    const fallback = field === 'start' ? this.msg.startLabelFallback : this.msg.endLabelFallback;

    const label = this.hasSlot(slot) ? unsafeHTML(this.getSlotContent(slot)) : fallback;

    return html`<div class="mb-1 text-xs font-medium text-slate-600">${label}</div>`;
  }

  private renderTimeText(field: 'start' | 'end'): TemplateResult {
    const value = field === 'start' ? this.startTime : this.endTime;
    const placeholder = field === 'start' ? this.msg.startPlaceholder : this.msg.endPlaceholder;
    const formatted = this.formatForDisplay(value);

    if (!formatted) {
      return html`<span class="text-slate-400">${placeholder}</span>`;
    }

    return html`<span class="text-slate-900">${formatted}</span>`;
  }

  private renderOvernightBadge(): TemplateResult {
    const overnight = this.isOvernight(this.startTime, this.endTime);
    if (!overnight) return html`${nothing}`;

    return html`
      <span
        class="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 border border-amber-200"
        aria-label="Next day"
      >
        ${this.msg.nextDayShort}
      </span>
    `;
  }

  private renderLoading(): TemplateResult {
    if (!this.loading) return html`${nothing}`;

    return html`
      <div class="mt-2 flex items-center gap-2 text-sm text-slate-500">
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
        <div>${this.msg.loading}</div>
      </div>
    `;
  }

  private renderPicker(field: 'start' | 'end'): TemplateResult {
    if (this.loading) return html`${nothing}`;
    if (this.activeField !== field) return html`${nothing}`;

    const options = this.buildTimeOptions();
    const draftValue = field === 'start' ? this.draftStart : this.draftEnd;

    const startNormalized = this.normalizeTimeValue(this.draftStart || this.startTime);

    const dialogId = field === 'start' ? 'ws-start-dialog' : 'ws-end-dialog';

    const dialogTitle = field === 'start' ? this.msg.startLabelFallback : this.msg.endLabelFallback;

    return html`
      <div class="fixed inset-0 z-50">
        <button
          type="button"
          class="absolute inset-0 bg-black/30"
          aria-label="Close"
          @click=${this.handleBackdropClick}
        ></button>

        <div
          class="absolute left-1/2 top-1/2 w-[min(520px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl border border-slate-200"
          role="dialog"
          aria-modal="true"
          aria-label=${dialogTitle}
          id=${dialogId}
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div class="text-sm font-semibold text-slate-800">${dialogTitle}</div>
            <button
              type="button"
              class="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
              @click=${this.handleBackdropClick}
            >
              ✕
            </button>
          </div>

          <div class="p-4">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div class="mb-1 text-xs font-medium text-slate-600">Input</div>
                <input
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  type="time"
                  step=${this.showSeconds ? '1' : '60'}
                  .value=${draftValue}
                  ?disabled=${this.disabled}
                  ?readonly=${this.readonly}
                  @input=${(e: Event) => this.handleDraftInput(field, e)}
                />
                <div class="mt-1 text-xs text-slate-500">
                  ${this.minTime ? html`<span>min: ${this.minTime}</span>` : html`${nothing}`}
                  ${this.maxTime ? html`<span class="ml-2">max: ${this.maxTime}</span>` : html`${nothing}`}
                </div>
              </div>

              <div>
                <div class="mb-1 text-xs font-medium text-slate-600">Quick pick</div>
                <select
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  .value=${draftValue}
                  @change=${(e: Event) => {
                    const sel = e.target as HTMLSelectElement;
                    if (field === 'start') this.draftStart = sel.value;
                    else this.draftEnd = sel.value;
                  }}
                >
                  <option value="">—</option>
                  ${options.map(opt => {
                    const inRange = this.isTimeWithinMinMax(opt);

                    let disabled = !inRange;
                    if (field === 'end' && startNormalized && opt) {
                      // Apply end-vs-start validity rules as disabled options
                      disabled = disabled || !this.isEndValidAgainstStart(startNormalized, opt);
                    }

                    return html`<option value=${opt} ?disabled=${disabled}>${opt}</option>`;
                  })}
                </select>
                ${field === 'end' && this.startTime
                  ? html`<div class="mt-1 text-xs text-slate-500">End options consider start time, duration rules, and overnight setting.</div>`
                  : html`${nothing}`}
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <button
                type="button"
                class="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                @click=${() => this.handleClear(field)}
              >
                ${this.msg.clear}
              </button>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  @click=${this.handleBackdropClick}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  @click=${() => this.handleConfirm(field)}
                >
                  ${this.msg.confirm}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getLang();
    this.msg = messages[lang];

    if (!this.isEditing) {
      return this.renderViewMode();
    }

    const hasError = Boolean(this.error && this.error.trim());

    const startBtnId = 'ws-start-btn';
    const endBtnId = 'ws-end-btn';

    const describedBy = hasError ? 'ws-error' : (this.hasSlot('Helper') ? 'ws-helper' : undefined);

    return html`
      <div class=${this.getContainerClasses()}>
        ${this.renderLabel()}

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <!-- START -->
          <div>
            ${this.renderFieldHeader('start')}
            <button
              id=${startBtnId}
              type="button"
              class=${this.getFieldButtonClasses(this.activeField === 'start')}
              ?disabled=${this.disabled}
              aria-invalid=${hasError ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
              aria-describedby=${describedBy ?? nothing}
              @click=${() => this.handleOpen('start')}
            >
              <div class="flex min-w-0 items-center gap-2">
                <span class="inline-flex h-5 w-5 items-center justify-center text-slate-500">🕒</span>
                <span class="truncate">${this.renderTimeText('start')}</span>
              </div>
              <span class="text-slate-400">▾</span>
            </button>
          </div>

          <!-- END -->
          <div>
            ${this.renderFieldHeader('end')}
            <button
              id=${endBtnId}
              type="button"
              class=${this.getFieldButtonClasses(this.activeField === 'end')}
              ?disabled=${this.disabled}
              aria-invalid=${hasError ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
              aria-describedby=${describedBy ?? nothing}
              @click=${() => this.handleOpen('end')}
            >
              <div class="flex min-w-0 items-center gap-2">
                <span class="inline-flex h-5 w-5 items-center justify-center text-slate-500">🕒</span>
                <span class="truncate">${this.renderTimeText('end')}</span>
                ${this.renderOvernightBadge()}
              </div>
              <span class="text-slate-400">▾</span>
            </button>
          </div>
        </div>

        ${this.renderLoading()}

        ${hasError || this.hasSlot('Helper')
          ? html`
              <div id=${hasError ? 'ws-error' : 'ws-helper'}>
                ${this.renderHelperOrError()}
              </div>
            `
          : html`${nothing}`}

        ${this.renderPicker('start')}
        ${this.renderPicker('end')}

        <!-- Hidden form fields (optional) -->
        <input type="hidden" name=${this.name ? `${this.name}.startTime` : ''} .value=${this.startTime ?? ''} />
        <input type="hidden" name=${this.name ? `${this.name}.endTime` : ''} .value=${this.endTime ?? ''} />
      </div>
    `;
  }
}
