/// <mls fileReference="_102020_/l2/molecules/groupShowProgress/progressRing.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// PROGRESS RING MOLECULE
// =============================================================================
// Skill Group: groupShowProgress (show + progress)
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  loading: 'Loading',
};
const message_pt = {
  loading: 'Carregando',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: message_pt,
};
/// **collab_i18n_end**

@customElement('molecules--group-show-progress--progress-ring-102020')
export class GroupShowProgressProgressRingMolecule extends MoleculeAuraElement {
  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = [];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  /**
   * Progress value (0–100). null = indeterminate
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
   * Show value in center
   */
  @propertyDataSource({ type: Boolean })
  showValue: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SIZE MAP
  // ===========================================================================
  private getSizeProps() {
    // SVG viewBox is 40x40, so scale accordingly
    switch (this.size) {
      case 'xs':
        return { diameter: 16, stroke: 2.5, font: 'text-[10px]' };
      case 'sm':
        return { diameter: 24, stroke: 3, font: 'text-xs' };
      case 'md':
        return { diameter: 40, stroke: 4, font: 'text-base' };
      case 'lg':
        return { diameter: 64, stroke: 6, font: 'text-xl' };
      default:
        return { diameter: 40, stroke: 4, font: 'text-base' };
    }
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const { diameter, stroke, font } = this.getSizeProps();
    const radius = (diameter - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const isIndeterminate = this.value === null || this.value === undefined;
    // Clamp value if determinate
    let clampedValue = 0;
    if (!isIndeterminate) {
      clampedValue = Math.max(0, Math.min(100, Number(this.value)));
    }
    // Progress offset for SVG stroke-dasharray
    const progress = isIndeterminate ? 0 : clampedValue;
    const offset = circumference * (1 - progress / 100);
    // a11y
    const ariaLabel = this.label || this.msg.loading;
    const ariaProps = isIndeterminate
      ? {
          role: 'progressbar',
          'aria-label': ariaLabel,
        }
      : {
          role: 'progressbar',
          'aria-label': ariaLabel,
          'aria-valuenow': clampedValue,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
        };
    // Visual state
    const isComplete = !isIndeterminate && clampedValue === 100;
    // CSS classes
    const ringBase = [
      'relative',
      'inline-block',
      'align-middle',
      'select-none',
    ].join(' ');
    const svgClass = [
      'block',
      'w-full',
      'h-full',
      isIndeterminate ? 'animate-spin-slow' : '',
    ].join(' ');
    const trackColor = 'stroke-slate-200';
    const progressColor = isComplete
      ? 'stroke-sky-500'
      : isIndeterminate
      ? 'stroke-sky-400'
      : 'stroke-sky-500';
    const progressStyle = [
      progressColor,
      isIndeterminate ? 'opacity-60' : '',
      isComplete ? 'transition-none' : 'transition-all duration-300',
    ].join(' ');
    // Centered value
    const showCenterValue = this.showValue && !isIndeterminate;
    // Render
    return html`
      <span
        class="${ringBase}"
        style="width:${diameter}px; height:${diameter}px;"
        ...=${ariaProps}
      >
        <svg
          class="${svgClass}"
          width="${diameter}"
          height="${diameter}"
          viewBox="0 0 ${diameter} ${diameter}"
          fill="none"
        >
          <!-- Track -->
          <circle
            class="${trackColor}"
            cx="${diameter / 2}"
            cy="${diameter / 2}"
            r="${radius}"
            stroke-width="${stroke}"
            fill="none"
          />
          <!-- Progress -->
          <circle
            class="${progressStyle}"
            cx="${diameter / 2}"
            cy="${diameter / 2}"
            r="${radius}"
            stroke-width="${stroke}"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${isIndeterminate ? circumference * 0.25 : offset}"
            style="transition: stroke-dashoffset 0.3s cubic-bezier(.4,1,.7,1);"
          />
        </svg>
        ${showCenterValue
          ? html`<span
              class="absolute inset-0 flex items-center justify-center font-medium text-slate-700 ${font} pointer-events-none select-none"
              >${clampedValue}%</span
            >`
          : nothing}
      </span>
      <style>
        /* Custom animation for indeterminate spinner */
        .animate-spin-slow {
          animation: spin-slow 1.2s linear infinite;
        }
        @keyframes spin-slow {
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
    `;
  }
}
