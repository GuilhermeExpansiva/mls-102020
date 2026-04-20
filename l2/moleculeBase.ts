/// <mls fileReference="_102020_/l2/moleculeBase.ts" enhancement="_102027_/l2/enhancementLit" />

import { StateLitElement } from '/_102027_/l2/stateLitElement.js';


// =============================================================================
// BASE CLASS
// =============================================================================

export class MoleculeAuraElement extends StateLitElement {

  // ===========================================================================
  // SLOT TAGS DEFINITION
  // Override in child component
  // ===========================================================================

  protected slotTags: string[] = [];

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  connectedCallback() {
    super.connectedCallback();
    this.hideSlotTags();
  }

  // ===========================================================================
  // SLOT TAG VISIBILITY
  // ===========================================================================

  /**
   * Hides all slot tags defined in slotTags array
   */
  private hideSlotTags(): void {
    this.slotTags.forEach(tag => {
      this.querySelectorAll(tag).forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    });
  }

  // ===========================================================================
  // SLOT TAG READERS
  // ===========================================================================

  /**
   * Returns a single slot tag element by name
   */
  protected getSlot(tag: string): Element | null {
    return this.querySelector(tag);
  }

  /**
   * Returns all elements of a slot tag
   */
  protected getSlots(tag: string): Element[] {
    return Array.from(this.querySelectorAll(tag));
  }

  /**
   * Returns an attribute value from a slot tag
   */
  protected getSlotAttr(tag: string, attr: string): string | null {
    return this.querySelector(tag)?.getAttribute(attr) || null;
  }

  /**
   * Returns the innerHTML of a slot tag
   */
  protected getSlotContent(tag: string): string {
    return this.querySelector(tag)?.innerHTML || '';
  }

  /**
   * Checks if a slot tag exists
   */
  protected hasSlot(tag: string): boolean {
    return this.querySelector(tag) !== null;
  }

}
