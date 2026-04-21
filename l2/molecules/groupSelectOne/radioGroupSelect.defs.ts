/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/radioGroupSelect.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: molecules--group-select-one--radio-group-select-102020

# Objective
Permitir ao usuário selecionar exatamente uma opção entre várias apresentadas, utilizando radio buttons, com suporte a orientação vertical ou horizontal.

# Responsibilities
- Exibir uma lista de opções, cada uma representada por um radio button.
- Permitir a seleção de apenas uma opção por vez.
- Suportar orientação vertical (opções empilhadas) e horizontal (opções lado a lado), configurável.
- Receber a lista de opções como entrada.
- Permitir definir qual opção está selecionada inicialmente.
- Emitir um evento ao alterar a seleção, informando o valor selecionado.
- Suportar estados desabilitado e somente leitura, aplicando-os a todas as opções.
- Permitir marcar o componente como obrigatório (required).
- Exibir mensagem de erro quando fornecida.
- Permitir atribuir um nome ao grupo de radio buttons para integração com formulários.
- Suportar estado de carregamento (loading), exibindo indicação visual apropriada.
- Permitir customização do conteúdo de cada opção via Slot Tag 'Item'.

# Constraints
- Apenas uma opção pode ser selecionada por vez.
- Quando desabilitado ou somente leitura, nenhuma opção pode ser alterada pelo usuário.
- Quando obrigatório, não permitir estado sem seleção ao submeter.
- A mensagem de erro deve ser exibida apenas quando fornecida.
- O estado de carregamento deve impedir interação com as opções.
- O nome do grupo deve ser único dentro do contexto do formulário para evitar conflitos.
- A orientação (vertical ou horizontal) deve ser aplicada de forma consistente a todas as opções.

# Notes
- O estado selecionado, desabilitado, erro e carregamento devem ser refletidos visualmente de forma clara.
- A customização do conteúdo de cada opção permite flexibilidade na apresentação das opções.`;

