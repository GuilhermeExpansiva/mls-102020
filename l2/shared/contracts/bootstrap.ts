/// <mls fileReference="_102020_/l2/shared/contracts/bootstrap.ts" enhancement="_blank" />
export type AuraShellMode = 'spa' | 'pwa';

export type AuraDeviceKind = 'desktop' | 'mobile';

export type AuraAsideMode = 'inline' | 'drawer' | 'fullscreen';

export interface AuraRegionVisibility {
  header: boolean;
  aside: boolean;
  content: boolean;
}

export interface AuraLayoutConfig {
  regions: {
    desktop: AuraRegionVisibility;
    mobile: AuraRegionVisibility;
  };
  asideMode: {
    desktop: AuraAsideMode;
    mobile: AuraAsideMode;
  };
}

export interface AuraRegionRendererConfig {
  entrypoint: string;
  tag: string;
}

export interface AuraNavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

export interface AuraModuleShellPreferences {
  layout?: Partial<AuraLayoutConfig>;
}

export interface AuraBootConfig {
  projectId: string;
  moduleId: string;
  basePath: string;
  shellMode: AuraShellMode;
  device: AuraDeviceKind;
  contentEntrypoint: string;
  contentTag: string;
  headerEntrypoint?: string;
  headerTag?: string;
  asideEntrypoint?: string;
  asideTag?: string;
  pageTitle?: string;
  navigation?: AuraNavigationItem[];
  moduleLinks?: AuraNavigationItem[];
  layout: AuraLayoutConfig;
}

declare global {
  interface Window {
    collabAuraShellControls?: {
      toggleAside: () => void;
      openAside: () => void;
      closeAside: () => void;
    };
  }

  interface Window {
    collabBoot?: AuraBootConfig;
  }
}
