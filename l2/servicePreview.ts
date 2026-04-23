/// <mls fileReference="_102020_/l2/servicePreview.ts" enhancement="_102027_/l2/enhancementLit.ts"/>

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { globalState, setState, initState, getState } from '/_102027_/l2/collabState.js';
import { getPath } from '/_102027_/l2/utils.js';
import { getConfigProject } from '/_102027_/l2/libProjectConfig.js';
import { getLastOpenedFiles, } from '/_102027_/l2/libCommom.js';
import { getDependenciesByHtml } from '/_102020_/l2/buildFile.js';

import '/_102025_/l2/collabMessagesPrompt.js';

import '/_102027_/l2/collabSpliterVerticalVarFixed.js';
import '/_102027_/l2/collabSpliterHorizontalVarFixed.js';

import { PreviewModeAura } from '/_102020_/l2/previewModeAura.js';
import { IJSONDependence } from '/_102027_/l2/libCompile.js';
import { OpenedFileL2 } from '/_102027_/l2/libCommom.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IOptions } from '/_102027_/l2/serviceBase.js';

/// **collab_i18n_start**
const message_pt = {
  loading: 'Carregando preview...',
  promptPlaceholder: 'Digite aqui @@ para agentes',
  dark: ' escuro',
  light: 'claro',
  pause: 'Preview pausado',
  run: 'Preview executando',
}

const message_en = {
  loading: 'Loading preview...',
  promptPlaceholder: 'Type here @@ for agents',
  pause: 'Preview paused',
  run: 'Preview running',
  dark: 'dark',
  light: 'light',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-102020')
export class ServicePreview extends ServiceBase {

  private msg: MessageType = messages['en'];
  private languages: ILanguage = {};

  @query('iframe') elPreview: HTMLIFrameElement | undefined;

  @property() modePreview: PreviewMode = 'Desktop';
  @property({ type: Boolean }) watch: boolean = true;
  @property({ type: Boolean }) light: boolean = true;
  @property() msize: string = '';
  @property() lang: string = 'en';

  @state() actualFiles: mls.stor.IInfo | undefined;
  @state() actualModels: mls.editor.IModels = { defs: undefined, html: undefined, style: undefined, test: undefined, ts: undefined };
  @state() actualTheme: string = 'Default';

  @state() project: number = 0;
  @state() shortName: string = '';
  @state() folder: string = '';


  constructor() {
    super();
    window.preview = {
      editor: undefined,
      iframe: undefined,
    };
    initState('preview', { pausePreview: false, service: this });
  }

  public details: IService = {
    icon: '&#xf15b',
    state: 'foreground',
    position: 'right',
    tooltip: 'Preview Aura',
    visible: true,
    widget: '_102020_servicePreview',
    level: [5]
  }

  public onClickMain(op: string): void {
    if (this.menu.setMode) this.menu.setMode('initial');
  }

  public onClickTabs(index: number) {

    if (index === PreviewType.Desktop) {
      this.modePreview = 'Desktop';
    }
    if (index === PreviewType.Mobile) {
      this.modePreview = 'Mobile';
    }

    this.modePreview = PreviewType[index] as PreviewMode;
    this.updatePreviewMode();
  }


  public onClickTools(op: string) {

    if (op === 'watchPreview') this.toogleWatch();
    else if (op === 'languages') this.changeLanguage();
    else if (op === 'darkLight') this.toggleDarkLight();
  }


  public menu: IServiceMenu = {
    title: 'Example',
    main: {},
    tools: {
      darkLight: {
        type: 'cycle',
        selected: 0,
        options: [
          { text: this.msg.light, icon: 'f185' },
          { text: this.msg.dark, icon: 'f186' },
        ]
      },
      languages: {
        type: 'dropdown',
        selected: 0,
        options: []
      },
      watchPreview: {
        type: 'cycle',
        selected: 0,
        options: [
          { text: this.msg.run, icon: 'f04c' },
          { text: this.msg.pause, icon: 'f04b' },
        ]
      },
    },
    tabs: {
      group: 'Mode',
      type: 'full',
      selected: 0,
      options: [
        { text: 'Desktop', icon: 'f390' },
        { text: 'Mobile', icon: 'f3cf' },
      ]
    },
    onClickMain: this.onClickMain.bind(this),
    onClickTabs: this.onClickTabs.bind(this),
    onClickTools: this.onClickTools.bind(this),
  }

  async onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    if (visible) {
      await this.setActualFileInfos();
      this.createPreview();
    }

  }

  private setEvents() {
    mls.events.addEventListener([2, 3, 4, 7], ['FileAction'], this.onFileAction.bind(this));
    mls.events.addEventListener([2, 3], ['styleChanged' as any], this.onStyleChanged.bind(this));
  }

  // Implementations

  private toogleWatch() {
    this.watch = this.menu.tools.watchPreview.selected === 0;
    if (this.watch) {
      this.createPreview();
    }
  }

  private toggleDarkLight() {
    this.light = !this.light;
    if (!mls.actual[2].left || !this.watch) return this.light;

    const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
    if (htmlEl) {
      if (this.light) {
        // Light mode: remove both Tailwind class and custom data-theme
        htmlEl.removeAttribute('data-theme');
        htmlEl.classList.remove('dark');
      } else {
        // Dark mode: add Tailwind class 'dark' + data-theme for custom tokens/less
        htmlEl.setAttribute('data-theme', 'dark');
        htmlEl.classList.add('dark');
      }
    }

    this.onStyleChanged();
    return this.light;
  }

  private changeLanguage() {

    if (this.menu.tools.languages.selected === undefined) return;
    const opMenu = this.menu.tools.languages.options[this.menu.tools.languages.selected as number].text;
    const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
    if (htmlEl) htmlEl.lang = this.languages[opMenu].acronym;
    this.lang = this.languages[opMenu].acronym;
    const variation = Object.keys(this.languages).indexOf(opMenu);

    globalState.globalVariation = !isNaN(variation) ? variation : 0;
    if (window.top) (window.top.window as any).globalVariation = !isNaN(variation) ? variation : 0;
    this.createPreview();

    return true;
  }

  private getIframePreviewHTML(): HTMLHtmlElement | undefined {
    if (!window.preview.iframe) throw new Error('Preview not created yet');
    const htmlEl = window.preview.iframe
      ?.contentDocument
      ?.querySelector('html') as HTMLHtmlElement;
    return htmlEl;
  }

  private onStyleChanged() {
    // TODO: change style
  }

  private onFileAction(ev: mls.events.IEvent) {

    if (![2].includes(ev.level) || (ev.type !== 'FileAction') || !ev.desc) return;
    const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
    const eventsValid = ['open', 'openBackground', 'statusOrErrorChanged', 'changed', 'new', 'modeCreated', 'editorChanged', 'openLink'];

    try {
      if (fileAction.position === this.position || !eventsValid.includes(fileAction.action)) return;

      if (fileAction.action === 'open' || (fileAction.action as any) === 'openBackground') {
        setState('preview.pausePreview', false);
        if (!this.watch && this.menu.selectTool) this.menu.selectTool('watchPreview');
      }

      if (fileAction.action as any === 'open') {
        this.createPreview();
        return;
      }

      if (this.menu && this.menu.closeMenu) this.menu.closeMenu();
      const rp = getState('preview.pausePreview');
      if (this.watch && !rp) {
        this.createPreview();
      }


    } catch (e) {
      console.info(e);
    }


  }


  private async setActualFileInfos() {

    this.setLastOpenedFile();
    if (!mls.actual[2].left) return;
    const { project, shortName, folder } = mls.actual[2].left as mls.stor.IFileInfo;
    this.project = project;
    this.shortName = shortName;
    this.folder = folder;

    await this.setActualFiles(project, shortName, folder);
    await this.setActualModels();


  }

  private setLastOpenedFile() {
    if (!mls.actual[2].left) {
      const lastFileOpened = getLastOpenedFiles(mls.actualProject || 0);

      if (!lastFileOpened || !lastFileOpened['2']) {
        this.clearPreview();
        return;
      }

      const lastFileLeft = (lastFileOpened['2'] as OpenedFileL2).left;
      if (!lastFileLeft) {
        this.clearPreview();
        return;
      }

      mls.actual[2].setFullName(lastFileLeft);
      const infoLast = getPath(lastFileLeft);
      if (!infoLast) throw new Error('[servicePreview] Not found path:' + lastFileLeft);

      const key = mls.stor.getKeyToFiles(infoLast.project, 2, infoLast.shortName, infoLast.folder, '.ts');
      const file = mls.stor.files[key];
      if (!file) {
        this.clearPreview();
        return;
      }

    }
  }

  private async setActualFiles(project: number, shortName: string, folder: string) {
    const files = await mls.stor.getFiles({
      folder,
      project,
      shortName,
      loadContent: true,
      level: 2
    });
    this.actualFiles = { ...files };
  }

  private async setActualModels() {
    if (!this.actualFiles) return;

    if (!this.actualModels?.ts && this.actualFiles.ts) {
      this.actualModels.ts = await this.actualFiles.ts.getOrCreateModel();
    }
    if (!this.actualModels?.html && this.actualFiles.html) {
      this.actualModels.html = await this.actualFiles.html.getOrCreateModel();
    }
    if (!this.actualModels?.style && this.actualFiles.less) {
      this.actualModels.style = await this.actualFiles.less.getOrCreateModel();
    }

  }

  private createPreview() {

    const container = this.querySelector('#preview-container') as HTMLElement;
    if (!container) return;

    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('preview-wrapper');
    wrapper.classList.add(this.modePreview === 'Mobile' ? 'preview-mobile' : 'preview-desktop');

    const iframe = document.createElement('iframe');
    iframe.classList.add('preview-iframe');
    iframe.src = '/_102020_servicePreview';

    // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    wrapper.appendChild(iframe);
    container.appendChild(wrapper);

    window.preview.iframe = iframe;

    iframe.addEventListener('load', () => {
      this.writePreviewContent(iframe);

      // Apply current dark/light state and language to the new iframe
      const htmlEl = iframe.contentDocument?.querySelector('html');
      if (htmlEl) {
        htmlEl.lang = this.lang;
        if (!this.light) {
          htmlEl.setAttribute('data-theme', 'dark');
          htmlEl.classList.add('dark');
        }
      }

    });

    // Trigger load for about:blank
    this.writePreviewContentBlank(iframe);
    this.configureTools(true);
  }

  private writePreviewContentBlank(iframe: HTMLIFrameElement) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write(`<div>${this.msg.loading}</div>`);
      doc.close();

    } catch (e) {
      console.error('Error writing preview content:', e);
    }
  }

  private async writePreviewContent(iframe: HTMLIFrameElement) {

    await this.setActualFileInfos();

    if (!this.actualFiles || !this.actualFiles.html) throw new Error('No find html file');
    if (!this.actualFiles || !this.actualFiles.htmlContent) throw new Error('No find html file content');

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const domVirtual = document.createElement('div');
      domVirtual.innerHTML = this.actualFiles.htmlContent;
      doc.body.innerHTML = domVirtual.innerHTML;
      let ret = await getDependenciesByHtml(this.actualFiles.html, this.actualFiles.htmlContent, this.actualTheme, true);
      console.info(ret);
      await this.modeSinglePage(ret, iframe);

    } catch (e) {
      console.error('Error writing preview content:', e);
    }
  }

  private async modeSinglePage(json: IJSONDependence, iframe: HTMLIFrameElement) {
    if (!this.actualFiles || !this.actualFiles.html) return;
    const c = new PreviewModeAura(json, iframe, '2', false, this.actualFiles.html, this.actualModels);
    await c.init();
  }

  private updatePreviewMode() {

    if (!this.elPreview) return;
    const wrapper = this.querySelector('.preview-wrapper') as HTMLElement;
    if (!wrapper) {
      this.createPreview();
      return;
    }

    wrapper.classList.remove('preview-desktop', 'preview-mobile');
    wrapper.classList.add(this.modePreview === 'Mobile' ? 'preview-mobile' : 'preview-desktop');
  }

  private clearPreview() {
    const container = this.querySelector('#preview-container') as HTMLElement;
    if (!container) return;
    container.innerHTML = '';
    window.preview.iframe = undefined;
    this.configureTools(false);
  }


  // Languages

  private async setLanguages() {
    const project = mls.actualProject;
    if (!project) {
      this.languages = {
        'English': { acronym: 'en', name: 'English' }
      }
    } else {
      const config = await getConfigProject(project);

      if (!config || !config.languages || config.languages.length === 0) {
        this.languages = {
          'English': { acronym: 'en', name: 'English' }
        }
      } else {
        config.languages.forEach((entry, index) => {
          this.languages[`${entry.name}`] = {
            acronym: entry.language,
            name: entry.name,
          }
        });
      }
    }

    const languagesOptions = Object.keys(this.languages).map((lg) => {
      const obj = this.languages[lg];
      const newOpt: IOptions = {
        text: obj.name,
        class: `collab-flags ${obj.acronym}`
      }
      return newOpt;
    });

    if (this.menu.tools.languages) this.menu.tools.languages.options = languagesOptions;
    if (this.menu.refresh) this.menu.refresh();
  }

  private configureTools(enabled: boolean) {
    const tools = this.nav3Service?.querySelector('collab-nav-3-menu .tools') as HTMLElement;
    if (!tools) return;
    tools.style.opacity = enabled ? '1' : '.2';
    tools.style.pointerEvents = enabled ? 'all' : 'none';
  }

  // Life cycle

  async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProperties);
    this.setLanguages();
    this.configureTools(false);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearPreview();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    const hasMsize = changedProperties.has('msize');

    if (changedProperties.has('modePreview')) {
      this.updatePreviewMode();
    }
  }

  render() {

    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`<collab-spliter-vertical-var-fixed-102027 msize=${this.msize} withresize="false" fixedheight="100" complementcolor="var(--bg-primary-color)">

                <collab-spliter-horizontal-var-fixed-102027
                    slot="top"
                    complementcolor="var(--bg-primary-color);"
                    fixedwidth="30%"
                    fixedvisible= "closed" 
                >
                    <div slot="left" style="height:100%;" id="preview-container"></div>
                    <div slot="right" style="height:100%;" id="preview-details"></div>
                </collab-spliter-horizontal-var-fixed-102027>
                <div slot="bottom">
                    <collab-messages-prompt-102025
                        acceptAutoCompleteAgents="true"
                        scope="l${this.level}_preview"  
                        placeholder="${this.msg.promptPlaceholder}"
                        .onSend=${this.handleSend.bind(this)}
                    ></collab-messages-prompt-102025>
                </div>
            </collab-spliter-vertical-var-fixed-102027>`;
  }



  async handleSend(value: string, opt: { isSpecialMention: boolean, agentName: string }) {
    console.info('In development')
  }


}



enum PreviewType {
  'Desktop' = 0,
  'Mobile' = 1,
}

type PreviewMode = 'Desktop' | 'Mobile'

interface ILanguage {
  [key: string]: { acronym: string, name: string }
}