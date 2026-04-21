/// <mls fileReference="_102020_/l2/molecules/groupSelectFileForUpload/dragDropPreview.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectFileForUpload';
export const skill = `# Metadata
- TagName: molecules--group-select-file-for-upload--drag-drop-preview-102020

# Objective
Permitir ao usuário selecionar múltiplas imagens para upload utilizando uma área interativa de drag-and-drop ou seleção manual, exibindo previews visuais das imagens escolhidas e fornecendo feedback visual durante a interação.

# Responsibilities
- Permitir seleção de múltiplos arquivos de imagem por drag-and-drop e/ou clique em área interativa.
- Exibir miniaturas (previews) de todas as imagens selecionadas antes do upload.
- Emitir evento de mudança contendo a lista de arquivos selecionados.
- Validar e rejeitar arquivos que não sejam imagens, emitindo evento de rejeição para arquivos inválidos.
- Permitir remoção individual de imagens da seleção, atualizando os previews imediatamente.
- Fornecer feedback visual ao usuário ao arrastar arquivos sobre a área de drop.
- Permitir limpar toda a seleção de arquivos (reset).
- Indicar visualmente o estado vazio quando nenhuma imagem estiver selecionada.

# Constraints
- Aceitar apenas arquivos de imagem (ex: JPEG, PNG, GIF).
- Não realizar upload automático dos arquivos selecionados.
- Permitir seleção de múltiplos arquivos em uma única interação.
- Exibir mensagem de erro ou destaque visual para arquivos rejeitados.
- Garantir que a área de drag-and-drop seja claramente destacada e responsiva a diferentes tamanhos de tela.
- Integrar botão ou link para seleção manual de arquivos à área de drop.
- Impedir seleção de arquivos inválidos e prevenir estados inconsistentes na seleção.

# Notes
- O componente deve ser responsivo e acessível.
- O feedback visual deve ser claro durante todas as etapas de interação do usuário.`;

