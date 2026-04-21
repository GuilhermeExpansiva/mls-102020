/// <mls fileReference="_102020_/l2/molecules/groupSelectFileForUpload/dragDropPreview.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SELECT FILE FOR UPLOAD — DRAG DROP IMAGE PREVIEW MOLECULE
// =============================================================================
// Skill Group: groupSelectFileForUpload
// This molecule does NOT contain business logic.
import {
  html,
  TemplateResult,
  nothing,
  unsafeHTML
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  propertyDataSource
} from '/_102027_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102020_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Drag and drop images here or click to select',
  helper: 'Accepted formats: JPG, PNG, GIF. Max size: 5MB per image.',
  remove: 'Remove',
  removeAll: 'Remove all',
  loading: 'Uploading...',
  errorType: 'Some files are not valid images.',
  errorSize: 'Some files exceed the maximum size.',
  errorCount: 'Too many files selected.',
  empty: 'No images selected',
  previewAlt: 'Image preview',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Arraste e solte imagens aqui ou clique para selecionar',
    helper: 'Formatos aceitos: JPG, PNG, GIF. Tamanho máx: 5MB por imagem.',
    remove: 'Remover',
    removeAll: 'Remover todas',
    loading: 'Enviando...',
    errorType: 'Alguns arquivos não são imagens válidas.',
    errorSize: 'Alguns arquivos excedem o tamanho máximo.',
    errorCount: 'Muitos arquivos selecionados.',
    empty: 'Nenhuma imagem selecionada',
    previewAlt: 'Pré-visualização da imagem',
  },
};
/// **collab_i18n_end**

@customElement('molecules--group-select-file-for-upload--drag-drop-preview-102020')
export class SelectFileForUploadDragDropImagePreviewMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Trigger'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: Object })
  value: File[] = [];

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: Boolean })
  multiple = false;

  @propertyDataSource({ type: String })
  accept: string = 'image/*';

  @propertyDataSource({ type: Number, attribute: 'max-size-kb' })
  maxSizeKb = 5120; // 5MB default

  @propertyDataSource({ type: Number, attribute: 'max-files' })
  maxFiles = 0;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private isDragging = false;

  @state()
  private inputId = `file-input-${Math.random().toString(36).slice(2)}`;

  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private onZoneClick(e: Event) {
    if (this.disabled || this.loading) return;
    const input = this.renderRoot.querySelector(`#${this.inputId}`) as HTMLInputElement;
    if (input) input.click();
  }

  private onZoneKeyDown(e: KeyboardEvent) {
    if (this.disabled || this.loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.onZoneClick(e);
    }
  }

  private onDragOver(e: DragEvent) {
    if (this.disabled || this.loading) return;
    e.preventDefault();
    this.isDragging = true;
  }

  private onDragLeave(e: DragEvent) {
    if (this.disabled || this.loading) return;
    this.isDragging = false;
  }

  private onDrop(e: DragEvent) {
    if (this.disabled || this.loading) return;
    e.preventDefault();
    this.isDragging = false;
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length > 0) {
      this.handleFiles(files);
    }
  }

  private onInputChange(e: Event) {
    if (this.disabled || this.loading) return;
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length > 0) {
      this.handleFiles(files);
    }
    // Reset input so selecting the same file again triggers change
    input.value = '';
  }

  private handleFiles(files: File[]) {
    // Validation
    const valid: File[] = [];
    const rejected: File[] = [];
    let rejectReason: 'type' | 'size' | 'count' | null = null;
    // Accept types
    const acceptTypes = this.accept ? this.accept.split(',').map(s => s.trim()) : ['image/*'];
    // Current value
    let currentFiles = Array.isArray(this.value) ? [...this.value] : [];
    // File count validation
    if (this.maxFiles > 0 && (currentFiles.length + files.length) > this.maxFiles) {
      rejectReason = 'count';
      this.dispatchEvent(new CustomEvent('reject', {
        bubbles: true,
        composed: true,
        detail: { files, reason: 'count' }
      }));
      return;
    }
    for (const file of files) {
      // Type validation
      if (!this.isAcceptedType(file, acceptTypes)) {
        rejected.push(file);
        rejectReason = 'type';
        continue;
      }
      // Size validation
      if (this.maxSizeKb > 0 && file.size > this.maxSizeKb * 1024) {
        rejected.push(file);
        rejectReason = 'size';
        continue;
      }
      valid.push(file);
    }
    // If any rejected, emit event
    if (rejected.length > 0 && rejectReason) {
      this.dispatchEvent(new CustomEvent('reject', {
        bubbles: true,
        composed: true,
        detail: { files: rejected, reason: rejectReason }
      }));
    }
    // If valid files, merge into value
    if (valid.length > 0) {
      if (this.multiple) {
        // Remove duplicates by name+size+lastModified
        const all = [...currentFiles, ...valid];
        const unique = all.filter((file, idx, arr) =>
          arr.findIndex(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified) === idx
        );
        this.value = unique;
      } else {
        this.value = [valid[0]];
      }
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      }));
    }
  }

  private isAcceptedType(file: File, acceptTypes: string[]): boolean {
    if (!acceptTypes.length || acceptTypes.includes('*')) return true;
    const mime = file.type;
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    for (const accept of acceptTypes) {
      if (accept === '*/*') return true;
      if (accept.endsWith('/*')) {
        const prefix = accept.split('/')[0];
        if (mime.startsWith(prefix + '/')) return true;
      } else if (accept.startsWith('.')) {
        if (ext === accept.toLowerCase()) return true;
      } else {
        if (mime === accept) return true;
      }
    }
    // Fallback: allow only image/*
    return mime.startsWith('image/');
  }

  private handleRemoveFile(idx: number) {
    if (this.disabled || this.loading) return;
    const files = Array.isArray(this.value) ? [...this.value] : [];
    files.splice(idx, 1);
    this.value = files;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleRemoveAll() {
    if (this.disabled || this.loading) return;
    this.value = [];
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private renderLabel(): TemplateResult | typeof nothing {
    if (this.hasSlot('Label')) {
      return html`<div class="mb-1 text-sm font-medium text-slate-700" id="label-${this.inputId}">${unsafeHTML(this.getSlotContent('Label'))}</div>`;
    }
    return nothing;
  }

  private renderHelperOrError(): TemplateResult | typeof nothing {
    if (this.error) {
      return html`<div class="mt-2 text-xs text-red-600" id="error-${this.inputId}">${this.error}</div>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<div class="mt-2 text-xs text-slate-500" id="helper-${this.inputId}">${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
    }
    return html`<div class="mt-2 text-xs text-slate-400" id="helper-${this.inputId}">${this.msg.helper}</div>`;
  }

  private renderDropZone(): TemplateResult {
    const zoneClasses = [
      'flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed rounded-lg cursor-pointer transition',
      this.isDragging ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-white',
      this.disabled || this.loading ? 'opacity-60 cursor-not-allowed' : '',
      this.error ? 'border-red-500' : '',
      'focus:outline-none focus:ring-2 focus:ring-sky-500',
    ].join(' ');
    return html`
      <div
        class="${zoneClasses}"
        role="button"
        tabindex="0"
        aria-label="${this.msg.placeholder}"
        aria-disabled="${this.disabled || this.loading}"
        aria-labelledby="label-${this.inputId}"
        aria-describedby="${this.error ? 'error-' + this.inputId : 'helper-' + this.inputId}"
        aria-invalid="${!!this.error}"
        @click=${this.onZoneClick}
        @keydown=${this.onZoneKeyDown}
        @dragover=${this.onDragOver}
        @dragleave=${this.onDragLeave}
        @drop=${this.onDrop}
      >
        ${this.hasSlot('Trigger')
          ? html`<div class="w-full flex flex-col items-center">${unsafeHTML(this.getSlotContent('Trigger'))}</div>`
          : html`
            <div class="flex flex-col items-center gap-2 py-4">
              <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10l-4-4m0 0l-4 4m4-4v12"/></svg>
              <span class="text-slate-500 text-sm">${this.msg.placeholder}</span>
            </div>
          `}
        <input
          id="${this.inputId}"
          type="file"
          class="hidden"
          ?multiple=${this.multiple}
          accept="${this.accept}"
          ?disabled=${this.disabled || this.loading}
          @change=${this.onInputChange}
          tabindex="-1"
          aria-hidden="true"
        />
      </div>
    `;
  }

  private renderFileList(): TemplateResult | typeof nothing {
    if (!Array.isArray(this.value) || this.value.length === 0) {
      return html`<div class="flex flex-col items-center justify-center py-6 text-slate-400 text-sm">${this.msg.empty}</div>`;
    }
    return html`
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        ${this.value.map((file, idx) => html`
          <div class="relative group border rounded-lg overflow-hidden bg-slate-50 flex flex-col items-center p-2">
            <div class="w-24 h-24 flex items-center justify-center bg-white border rounded">
              ${this.renderImagePreview(file)}
            </div>
            <div class="mt-2 w-full text-xs text-center truncate" title="${file.name}">${file.name}</div>
            <div class="w-full text-xs text-slate-400 text-center">${this.formatSize(file.size)}</div>
            <button
              type="button"
              class="absolute top-1 right-1 bg-white rounded-full shadow p-1 text-slate-500 hover:text-red-600 focus:outline-none"
              title="${this.msg.remove}"
              @click=${() => this.handleRemoveFile(idx)}
              ?disabled=${this.disabled || this.loading}
              tabindex="0"
              aria-label="${this.msg.remove}"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        `)}
      </div>
      <div class="flex justify-end mt-2">
        <button
          type="button"
          class="text-xs text-slate-500 hover:text-red-600 underline px-2 py-1 rounded focus:outline-none"
          @click=${this.handleRemoveAll}
          ?disabled=${this.disabled || this.loading}
          tabindex="0"
        >${this.msg.removeAll}</button>
      </div>
    `;
  }

  private renderImagePreview(file: File): TemplateResult {
    // Use object URL for preview
    const url = URL.createObjectURL(file);
    // Clean up after image loads
    const onLoad = (e: Event) => {
      URL.revokeObjectURL(url);
    };
    return html`
      <img
        src="${url}"
        alt="${this.msg.previewAlt}"
        class="object-cover w-full h-full rounded"
        @load=${onLoad}
        draggable="false"
      />
    `;
  }

  private formatSize(size: number): string {
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (size >= 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    }
    return size + ' B';
  }

  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    return html`
      <div class="w-full">
        ${this.renderLabel()}
        <div class="mt-1">
          ${this.renderDropZone()}
        </div>
        ${this.loading
          ? html`<div class="flex items-center gap-2 mt-4 text-slate-400"><svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>${this.msg.loading}</div>`
          : nothing}
        ${this.renderFileList()}
        ${this.renderHelperOrError()}
      </div>
    `;
  }
}
