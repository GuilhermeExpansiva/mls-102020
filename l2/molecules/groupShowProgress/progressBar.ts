/// <mls fileReference="_102020_/l2/molecules/groupShowProgress/progressBar.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// PROGRESS BAR MOLECULE
// =============================================================================
// Skill Group: show + progress
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  label: 'Progress',
  complete: 'Complete',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    label: 'Progresso',
    complete: 'Concluído',
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-show-progress--progress-bar-102020')
export class GroupShowProgressProgressBarMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = [];
  // ===========================================================================
  // PROPERTIES — From Contract
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
   * Accessible label
   */
  @propertyDataSource({ type: String })
  label: string = '';

  /**
   * Show numeric percentage
   */
  @propertyDataSource({ type: Boolean })
  showValue: boolean = false;

  // ===========================================================================
  // INTERNALS
  // ===========================================================================
  /**
   * Clamp value to [0, 100] if not null
   */
  private getClampedValue(): number | null {
    if (typeof this.value !== 'number' || isNaN(this.value)) return null;
    if (this.value < 0) return 0;
    if (this.value > 100) return 100;
    return Math.round(this.value);
  }

  /**
   * Map size prop to Tailwind height classes
   */
  private getBarHeightClass(): string {
    switch (this.size) {
      case 'xs': return 'h-2'; // 8px
      case 'sm': return 'h-3'; // 12px
      case 'lg': return 'h-6'; // 24px
      case 'md':
      default: return 'h-4'; // 16px
    }
  }

  /**
   * Map size prop to text size for value label
   */
  private getTextSizeClass(): string {
    switch (this.size) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'md':
      default: return 'text-base';
    }
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const clamped = this.getClampedValue();
    const isIndeterminate = clamped === null;
    const isComplete = clamped === 100;
    const ariaLabel = this.label || this.msg.label;
    // Accessibility attributes
    const a11yAttrs = {
      role: 'progressbar',
      'aria-label': ariaLabel,
      'aria-valuemin': isIndeterminate ? undefined : 0,
      'aria-valuemax': isIndeterminate ? undefined : 100,
      'aria-valuenow': isIndeterminate ? undefined : clamped,
    };
    // Bar height
    const barHeight = this.getBarHeightClass();
    // Progress bar background
    const bgBar = [
      'w-full',
      barHeight,
      'bg-slate-200',
      'rounded-full',
      'overflow-hidden',
      'relative',
    ].join(' ');
    // Progress fill
    const fillBase = [
      'absolute',
      'left-0',
      'top-0',
      'h-full',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'rounded-full',
    ];
    // Fill color
    const fillColor = isComplete
      ? 'bg-sky-500'
      : 'bg-sky-400';
    // Indeterminate animation
    const indeterminateAnim = [
      'animate-progress-indeterminate',
      'bg-sky-300',
      'w-1/3',
      'rounded-full',
      'absolute',
      'left-0',
      'top-0',
      'h-full',
    ].join(' ');
    // Value label
    const valueLabel = clamped !== null ? `${clamped}%` : '';
    // Complete label
    const completeLabel = this.msg.complete;
    // Text size
    const textSize = this.getTextSizeClass();
    // Label (above bar)
    const showLabel = !!this.label;
    // =======================================================================
    // RENDER
    // =======================================================================
    return html`
      <div class="flex flex-col gap-1 select-none">
        ${showLabel
          ? html`<div class="text-slate-700 font-medium ${textSize}">${this.label}</div>`
          : nothing}
        <div
          class="${bgBar}"
          ...=${a11yAttrs}
        >
          ${isIndeterminate
            ? html`
                <div class="${indeterminateAnim}"></div>
              `
            : html`
                <div
                  class="${[...fillBase, fillColor].join(' ')}"
                  style="width: ${clamped}%;"
                ></div>
              `}
        </div>
        ${!isIndeterminate && this.showValue
          ? html`
              <div class="flex items-center gap-2 mt-1">
                <span class="${textSize} text-slate-700 font-mono">
                  ${isComplete ? completeLabel : valueLabel}
                </span>
              </div>
            `
          : nothing}
      </div>
      <style>
        /* Indeterminate animation (slide left to right) */
        @keyframes progress-indeterminate {
          0% { left: -33%; width: 33%; }
          50% { left: 33%; width: 33%; }
          100% { left: 100%; width: 33%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
      </style>
    `;
  }
}
