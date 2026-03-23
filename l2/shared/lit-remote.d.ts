declare module 'https://esm.sh/lit@3' {
  export class LitElement extends HTMLElement {
    static styles?: unknown;
    requestUpdate(): void;
    createRenderRoot(): Element | ShadowRoot;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(): void;
  }

  export const html: (...args: unknown[]) => unknown;
  export const css: (...args: unknown[]) => unknown;
}
