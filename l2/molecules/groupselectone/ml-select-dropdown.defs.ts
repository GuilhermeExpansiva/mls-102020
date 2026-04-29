/// <mls fileReference="_102020_/l2/molecules/groupselectone/ml-select-dropdown.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: groupselectone--ml-select-dropdown
# Objective
Campo de seleção que permite ao usuário escolher uma única opção em uma lista suspensa e visualizar a opção escolhida.
# Responsibilities
- Permitir selecionar exatamente uma opção entre os itens fornecidos.
- Alternar entre abrir e fechar a lista ao acionar o campo, respeitando estados de desativado, somente leitura e carregamento.
- Atualizar o valor selecionado, fechar a lista e emitir evento de alteração ao escolher um item habilitado.
- Suportar modo de visualização quando a edição estiver desativada, exibindo apenas o texto selecionado ou um marcador quando não houver seleção.
- Exibir placeholder quando não houver seleção e não existir conteúdo de gatilho personalizado.
- Tratar itens desabilitados como não selecionáveis.
- Fechar a lista ao pressionar Escape ou ao clicar fora do componente.
- Emitir eventos de foco e perda de foco ao receber ou perder foco.
- Permitir agrupamento de opções com rótulo de grupo e itens associados.
- Permitir filtrar itens quando a busca estiver ativada, com base no texto dos itens.
- Exibir estado de carregamento e impedir abertura da lista durante carregamento.
- Validar obrigatoriedade e indicar erro quando não houver valor e não existir erro explícito.
- Exibir mensagem de erro quando houver texto de erro; caso contrário, exibir conteúdo auxiliar quando fornecido.
- Respeitar o nome do campo para integração com formulários.
- Exibir conteúdos fornecidos para rótulo, gatilho, ajuda, vazio, item e grupo.
- Exibir conteúdo de vazio quando não houver itens disponíveis ou quando todos estiverem filtrados.
# Constraints
- Não permitir seleção de mais de uma opção.
- Não permitir seleção de itens desabilitados.
- Não abrir a lista quando o componente estiver desativado, somente leitura ou em carregamento.
- Não considerar o campo válido quando obrigatório e sem valor.
# Notes
- Quando não houver seleção em modo de visualização, deve mostrar placeholder ou “—”.`;

