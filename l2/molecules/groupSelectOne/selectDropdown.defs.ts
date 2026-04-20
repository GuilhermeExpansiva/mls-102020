/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/selectDropdown.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: molecules--group-select-one--select-dropdown-102020

# Objective
Permitir que o usuário selecione exatamente um país de uma lista apresentada em formato de menu suspenso (dropdown), exibindo o país selecionado e suportando diferentes estados de interação.

# Responsibilities
- Exibir uma lista de países como opções para seleção.
- Permitir a seleção de exatamente um país por vez.
- Mostrar o país selecionado no campo principal do dropdown.
- Permitir limpar a seleção, se essa funcionalidade for especificada.
- Emitir um evento ao selecionar um país, informando o valor selecionado.
- Suportar estados de carregamento e de lista vazia.
- Suportar estados desabilitado e somente leitura.
- Receber a lista de países como entrada de dados.
- Permitir definir um valor inicial selecionado.
- Suportar mensagens de erro e estado obrigatório (required).

# Constraints
- Apenas um país pode ser selecionado por vez.
- Não deve permitir seleção múltipla simultânea.
- Não deve permitir seleção quando estiver desabilitado ou em modo somente leitura.
- Deve indicar visualmente os estados de carregamento, vazio, erro, desabilitado e somente leitura.
- Deve exibir um placeholder quando nenhum país estiver selecionado.
- Deve destacar visualmente o item selecionado na lista.
- Deve ser responsivo e acessível para navegação por teclado.
- Não deve aceitar valores fora da lista de países fornecida.

# Notes
- A funcionalidade de limpar a seleção é opcional e depende de configuração.
- O componente deve garantir que o estado obrigatório (required) seja respeitado quando especificado.
`;

