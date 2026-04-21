/// <mls fileReference="_102020_/l2/molecules/groupShowProgress/spinner.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SPINNER MOLECULE (show + progress group)
// =============================================================================
// Tag: molecules--group-show-progress--spinner-102020
// This molecule is a visual-only spinner/progress indicator. No slot tags.
import {
  html,
  TemplateResult,
  nothing
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  label: 'Loading',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    label: 'Carregando',
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-show-progress--spinner-102020')
export class GroupShowProgressSpinnerMolecule extends MoleculeAuraElement {
  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = [];

  // ===========================================================================
  // PROPERTIES
  // ===========================================================================
  /**
   * Progress value (0–100). null = indeterminate.
   */
  @propertyDataSource({ type: Number })
  value: number | null = null;

  /**
   * Visual size: 'xs', 'sm', 'md', 'lg'
   */
  @propertyDataSource({ type: String })
  size: string = 'md';

  /**
   * Accessible label for screen readers
   */
  @propertyDataSource({ type: String })
  label: string = '';

  /**
   * Show numeric value (only in determinate mode)
   */
  @propertyDataSource({ type: Boolean, attribute: 'show-value' })
  showValue: boolean = false;

  /**
   * Spinner color (Tailwind color class, e.g. 'text-sky-500')
   */
  @property({ type: String })
  color: string = 'text-sky-500';

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private clampedValue: number | null = null;

  // ===========================================================================
  // STATE CHANGE HANDLER (for derived value)
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    // Clamp value if needed
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.clampedValue = typeof value === 'number' && !isNaN(value)
        ? Math.max(0, Math.min(100, value))
        : null;
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  connectedCallback() {
    super.connectedCallback();
    // Clamp value on first connect
    this.clampedValue = typeof this.value === 'number' && !isNaN(this.value)
      ? Math.max(0, Math.min(100, this.value))
      : null;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    const msg = messages[lang];
    const ariaLabel = this.label || msg.label;
    const sizeClass = this.getSizeClass(this.size);
    const colorClass = this.color || 'text-sky-500';
    const isIndeterminate = this.clampedValue === null;
    const percent = this.clampedValue ?? 0;
    // Accessibility attributes
    const a11y = {
      role: 'progressbar',
      'aria-label': ariaLabel,
      'aria-valuemin': isIndeterminate ? undefined : 0,
      'aria-valuemax': isIndeterminate ? undefined : 100,
      'aria-valuenow': isIndeterminate ? undefined : percent,
    };
    return html`
      <span
        class="inline-flex items-center justify-center ${sizeClass} ${colorClass}"
        ...=${a11y}
        tabindex="-1"
        aria-hidden="false"
        style="pointer-events:none;user-select:none;"
      >
        ${isIndeterminate
          ? this.renderIndeterminateSpinner(sizeClass, colorClass)
          : this.renderDeterminateSpinner(percent, sizeClass, colorClass)}
        ${!isIndeterminate && this.showValue
          ? html`<span class="ml-2 text-xs font-medium text-slate-500">${percent}%</span>`
          : nothing}
      </span>
    `;
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  /**
   * Indeterminate spinner (animated SVG ring)
   */
  private renderIndeterminateSpinner(sizeClass: string, colorClass: string): TemplateResult {
    // SVG spinner, always spinning
    return html`
      <svg
        class="animate-spin ${colorClass}"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        width="100%"
        height="100%"
      >
        <circle
          class="opacity-25"
          cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    `;
  }

  /**
   * Determinate spinner (progress ring)
   */
  private renderDeterminateSpinner(percent: number, sizeClass: string, colorClass: string): TemplateResult {
    // SVG circular progress ring
    // 12px radius, 2px stroke, 2*PI*10 = 62.8
    const radius = 10;
    const stroke = 4;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = circumference * (1 - percent / 100);
    return html`
      <svg
        class="${colorClass}"
        width="24" height="24" viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          class="opacity-25"
          cx="12" cy="12" r="${normalizedRadius}"
          stroke="currentColor"
          stroke-width="${stroke}"
          fill="none"
        />
        <circle
          class="opacity-100 transition-all duration-300"
          cx="12" cy="12" r="${normalizedRadius}"
          stroke="currentColor"
          stroke-width="${stroke}"
          fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${progress}"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  // ===========================================================================
  // SIZE MAPPING
  // ===========================================================================
  private getSizeClass(size: string): string {
    switch ((size || '').toLowerCase()) {
      case 'xs':
        return 'w-4 h-4'; // 16px
      case 'sm':
        return 'w-6 h-6'; // 24px
      case 'lg':
        return 'w-12 h-12'; // 48px
      case 'md':
      default:
        return 'w-10 h-10'; // 40px
    }
  }
}
