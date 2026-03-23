/// <mls fileReference="_102020_/l2/shared/shell.ts" enhancement="_blank" />
import type { AuraAsideMode, AuraBootConfig, AuraDeviceKind } from '/_102020_/l2/shared/contracts/bootstrap.js';
import '/_102020_/l2/shared/layout/aura-aside.js';
import '/_102020_/l2/shared/layout/aura-header.js';
import {
  AURA_CLOSE_ASIDE_EVENT,
  AURA_OPEN_ASIDE_EVENT,
  AURA_TOGGLE_ASIDE_EVENT,
} from '/_102020_/l2/shared/layout/aura-shell-events.js';
import { LitElement, html } from '/_102020_/l2/shared/lit.js';

function isAuraBootConfig(value: unknown): value is AuraBootConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.projectId === 'string' &&
    typeof candidate.moduleId === 'string' &&
    typeof candidate.basePath === 'string' &&
    typeof candidate.shellMode === 'string' &&
    typeof candidate.device === 'string' &&
    typeof candidate.contentEntrypoint === 'string' &&
    typeof candidate.contentTag === 'string'
  );
}

type AuraRegionName = 'header' | 'aside' | 'content';
const MOBILE_BREAKPOINT_PX = 768;

const DEFAULT_REGION_TAGS: Record<Exclude<AuraRegionName, 'content'>, string> = {
  header: 'collab-aura-header',
  aside: 'collab-aura-aside',
};

export class CollabAuraShell extends LitElement {
  static properties = {
    bootConfig: { attribute: false },
    statusMessage: { state: true },
    resolvedDevice: { state: true },
    isAsideOpen: { state: true },
  };

  declare bootConfig?: AuraBootConfig;
  declare statusMessage: string;
  resolvedDevice: AuraDeviceKind = 'desktop';
  isAsideOpen = false;
  private mobileMediaQuery?: MediaQueryList;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!isAuraBootConfig(window.collabBoot)) {
      this.statusMessage = 'Invalid or missing window.collabBoot.';
      return;
    }

    this.bootConfig = window.collabBoot;
    this.resolvedDevice = this.resolveDevice();
    this.isAsideOpen = this.getDefaultAsideOpen(this.resolvedDevice);
    window.collabAuraShellControls = {
      toggleAside: this.handleToggleAside,
      openAside: this.handleOpenAside,
      closeAside: this.handleCloseAside,
    };
    this.mobileMediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
    this.mobileMediaQuery.addEventListener('change', this.handleViewportChange);
    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener(AURA_TOGGLE_ASIDE_EVENT, this.handleToggleAside as EventListener);
    window.addEventListener(AURA_OPEN_ASIDE_EVENT, this.handleOpenAside as EventListener);
    window.addEventListener(AURA_CLOSE_ASIDE_EVENT, this.handleCloseAside as EventListener);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('popstate', this.handlePopState);
    void this.mountModuleRoot();
  }

  disconnectedCallback() {
    delete window.collabAuraShellControls;
    this.mobileMediaQuery?.removeEventListener('change', this.handleViewportChange);
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener(AURA_TOGGLE_ASIDE_EVENT, this.handleToggleAside as EventListener);
    window.removeEventListener(AURA_OPEN_ASIDE_EVENT, this.handleOpenAside as EventListener);
    window.removeEventListener(AURA_CLOSE_ASIDE_EVENT, this.handleCloseAside as EventListener);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('popstate', this.handlePopState);
    super.disconnectedCallback();
  }

  private async mountModuleRoot() {
    if (!this.bootConfig) {
      return;
    }

    try {
      await this.importRegion('content');
      await Promise.all([
        this.importRegion('header'),
        this.importRegion('aside'),
      ]);
      this.requestUpdate();
    } catch (error) {
      this.statusMessage = error instanceof Error ? error.message : String(error);
    }
  }

  private readonly handleViewportChange = () => {
    this.syncResolvedDevice();
  };

  private readonly handleToggleAside = () => {
    this.syncResolvedDevice();
    const asideMode = this.getResolvedAsideMode();
    if (asideMode === 'inline' || !this.getBaseRegionVisibility('aside')) {
      return;
    }
    this.isAsideOpen = !this.isAsideOpen;
    this.requestUpdate();
  };

  private readonly handleOpenAside = () => {
    this.syncResolvedDevice();
    if (this.getResolvedAsideMode() === 'inline' || !this.getBaseRegionVisibility('aside')) {
      return;
    }
    this.isAsideOpen = true;
    this.requestUpdate();
  };

  private readonly handleCloseAside = () => {
    this.syncResolvedDevice();
    if (this.getResolvedAsideMode() === 'inline') {
      return;
    }
    this.isAsideOpen = false;
    this.requestUpdate();
  };

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    this.syncResolvedDevice();
    if (event.key === 'Escape' && this.getResolvedAsideMode() !== 'inline' && this.isAsideOpen) {
      this.isAsideOpen = false;
      this.requestUpdate();
    }
  };

  private readonly handlePopState = () => {
    this.syncResolvedDevice();
    if (this.getResolvedAsideMode() !== 'inline') {
      this.isAsideOpen = false;
      this.requestUpdate();
    }
  };

  private syncResolvedDevice() {
    const nextDevice = this.resolveDevice();
    if (nextDevice === this.resolvedDevice) {
      return;
    }

    this.resolvedDevice = nextDevice;
    this.isAsideOpen = this.getDefaultAsideOpen(nextDevice);
    this.requestUpdate();
  }

  private resolveDevice(): AuraDeviceKind {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches ? 'mobile' : 'desktop';
    }
    return this.bootConfig?.device ?? 'desktop';
  }

  private getDefaultAsideOpen(device: AuraDeviceKind) {
    return this.getAsideModeForDevice(device) === 'inline';
  }

  private getAsideModeForDevice(device: AuraDeviceKind): AuraAsideMode {
    return this.bootConfig?.layout.asideMode[device] ?? (device === 'mobile' ? 'drawer' : 'inline');
  }

  private getResolvedAsideMode(): AuraAsideMode {
    return this.getAsideModeForDevice(this.resolvedDevice);
  }

  private getRenderer(region: AuraRegionName) {
    if (!this.bootConfig) {
      return null;
    }

    if (region === 'content') {
      if (!this.bootConfig.contentEntrypoint || !this.bootConfig.contentTag) {
        throw new Error('Aura shell requires contentEntrypoint and contentTag in window.collabBoot.');
      }
      return {
        entrypoint: this.bootConfig.contentEntrypoint,
        tag: this.bootConfig.contentTag,
        fallback: false,
      };
    }

    const entrypoint = region === 'header' ? this.bootConfig.headerEntrypoint : this.bootConfig.asideEntrypoint;
    const tag = region === 'header' ? this.bootConfig.headerTag : this.bootConfig.asideTag;
    if (entrypoint && tag) {
      return {
        entrypoint,
        tag,
        fallback: false,
      };
    }

    return {
      entrypoint: '',
      tag: DEFAULT_REGION_TAGS[region],
      fallback: true,
    };
  }

  private async importRegion(region: AuraRegionName) {
    const renderer = this.getRenderer(region);
    if (!renderer || renderer.fallback) {
      return;
    }

    try {
      await import(renderer.entrypoint);
    } catch (error) {
      throw new Error(`Could not load Aura ${region} renderer from ${renderer.entrypoint}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private getBaseRegionVisibility(region: AuraRegionName) {
    const visibility = this.bootConfig?.layout.regions[this.resolvedDevice];
    return visibility?.[region] ?? true;
  }

  private getActualAsideOpen() {
    if (!this.getBaseRegionVisibility('aside')) {
      return false;
    }

    return this.getResolvedAsideMode() === 'inline' ? true : this.isAsideOpen;
  }

  private getRegionVisibility(region: AuraRegionName) {
    if (!this.getBaseRegionVisibility(region)) {
      return false;
    }

    const asideMode = this.getResolvedAsideMode();
    const isAsideOpen = this.getActualAsideOpen();

    if (region === 'aside') {
      return isAsideOpen;
    }

    if (asideMode === 'fullscreen' && isAsideOpen) {
      return false;
    }

    return true;
  }

  private mountRegion(region: AuraRegionName) {
    if (!this.bootConfig) {
      return;
    }

    const host = this.querySelector(`[data-region-host="${region}"]`);
    if (!host) {
      return;
    }

    if (!this.getBaseRegionVisibility(region)) {
      host.replaceChildren();
      return;
    }

    const renderer = this.getRenderer(region);
    if (!renderer) {
      host.replaceChildren();
      return;
    }

    const currentTagName = host.firstElementChild?.tagName.toLowerCase();
    if (currentTagName === renderer.tag) {
      const currentElement = host.firstElementChild as HTMLElement & { bootConfig?: AuraBootConfig } | null;
      if (currentElement) {
        currentElement.bootConfig = this.bootConfig;
      }
      return;
    }

    const element = document.createElement(renderer.tag) as HTMLElement & { bootConfig?: AuraBootConfig };
    element.bootConfig = this.bootConfig;
    host.replaceChildren(element);
  }

  updated() {
    if (!this.bootConfig) {
      return;
    }
    this.setAttribute('data-device', this.resolvedDevice);
    this.setAttribute('data-aside-mode', this.getResolvedAsideMode());
    this.setAttribute('data-aside-open', String(this.getActualAsideOpen()));
    this.mountRegion('header');
    this.mountRegion('aside');
    this.mountRegion('content');
  }

  render() {
    const styles = html`<style>
      collab-aura-shell {
        display: block;
        min-height: 100vh;
        color: #102a43;
        font-family: "Segoe UI", sans-serif;
        --aura-region-header-display: block;
        --aura-region-aside-display: block;
        --aura-region-content-display: block;
      }

      collab-aura-shell .layout {
        display: grid;
        min-height: 100vh;
        grid-template-rows: auto 1fr;
        background: #fffdfa;
      }

      collab-aura-shell .body {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        min-height: 0;
        background: #fffdfa;
        position: relative;
      }

      collab-aura-shell .body[data-aside-mode="drawer"],
      collab-aura-shell .body[data-aside-mode="fullscreen"],
      collab-aura-shell .body[data-aside-visible="false"] {
        grid-template-columns: minmax(0, 1fr);
      }

      collab-aura-shell .region {
        min-width: 0;
        min-height: 0;
      }

      collab-aura-shell .region.header {
        display: var(--aura-region-header-display);
      }

      collab-aura-shell .region.aside {
        display: var(--aura-region-aside-display);
        height: 100%;
      }

      collab-aura-shell .body[data-aside-mode="drawer"] .region.aside,
      collab-aura-shell .body[data-aside-mode="fullscreen"] .region.aside {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 30;
        max-width: min(320px, calc(100vw - 32px));
        width: 100%;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.28);
      }

      collab-aura-shell .body[data-aside-mode="fullscreen"] .region.aside {
        max-width: 100vw;
      }

      collab-aura-shell .region.content {
        display: var(--aura-region-content-display);
        padding: 24px;
        background:
          radial-gradient(circle at top right, rgba(255, 207, 117, 0.28), transparent 26%),
          linear-gradient(180deg, #f7f4ea 0%, #fffdfa 100%);
      }

      collab-aura-shell [data-region-host="aside"] {
        height: 100%;
      }

      collab-aura-shell .backdrop {
        position: fixed;
        inset: 0;
        z-index: 20;
        background: rgba(15, 23, 42, 0.42);
      }

      collab-aura-shell .error {
        margin: 24px;
        padding: 16px 18px;
        border-radius: 14px;
        border: 1px solid #f7c6c7;
        background: #fff1f2;
        color: #7a1f2a;
      }
    </style>`;

    if (!this.bootConfig) {
      return html`${styles}<div class="error">${this.statusMessage ?? 'Shell bootstrap was not provided.'}</div>`;
    }

    if (this.statusMessage) {
      return html`${styles}<div class="error">${this.statusMessage}</div>`;
    }

    const headerVisible = this.getRegionVisibility('header');
    const asideVisible = this.getRegionVisibility('aside');
    const contentVisible = this.getRegionVisibility('content');
    const asideMode = this.getResolvedAsideMode();
    const isAsideOpen = this.getActualAsideOpen();
    const shellStyle = [
      `--aura-region-header-display: ${headerVisible ? 'block' : 'none'}`,
      `--aura-region-aside-display: ${asideVisible ? 'block' : 'none'}`,
      `--aura-region-content-display: ${contentVisible ? 'block' : 'none'}`,
    ].join('; ');

    return html`
      <div
        style=${shellStyle}
        data-device=${this.resolvedDevice}
        data-aside-mode=${asideMode}
        data-aside-open=${String(isAsideOpen)}
      >
        ${styles}
        <div class="layout">
          <section class="region header" data-region="header" data-visible=${String(headerVisible)}>
            <div data-region-host="header"></div>
          </section>
          <div
            class="body"
            data-aside-visible=${String(asideVisible)}
            data-device=${this.resolvedDevice}
            data-aside-mode=${asideMode}
            data-aside-open=${String(isAsideOpen)}
          >
            ${asideMode !== 'inline' && isAsideOpen
        ? html`<button class="backdrop" type="button" aria-label="Close aside" @click=${this.handleCloseAside}></button>`
        : null}
            <aside class="region aside" data-region="aside" data-visible=${String(asideVisible)}>
              <div data-region-host="aside"></div>
            </aside>
            <main class="region content" data-region="content" data-visible=${String(contentVisible)}>
              <div data-region-host="content"></div>
            </main>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('collab-aura-shell', CollabAuraShell);
