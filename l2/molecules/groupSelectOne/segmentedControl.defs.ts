/// <mls fileReference="_102020_/l2/molecules/groupSelectOne/segmentedControl.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: molecules--group-select-one--segmented-control-102020

# Objective
Permitir ao usuário selecionar exatamente um item entre 2 a 5 opções apresentadas lado a lado, destacando visualmente a opção escolhida e suportando estados como desabilitado, somente leitura, obrigatório, erro e carregamento.

# Responsibilities
- Exibir simultaneamente todas as opções disponíveis como botões segmentados.
- Permitir a seleção de apenas uma opção por vez.
- Destacar visualmente o item atualmente selecionado.
- Permitir alteração da seleção ao interagir com outra opção.
- Emitir notificação de mudança ao selecionar uma nova opção.
- Permitir que toda a barra ou opções individuais estejam desabilitadas.
- Permitir estado somente leitura, impedindo alterações na seleção.
- Indicar visualmente quando o campo for obrigatório.
- Exibir mensagem de erro quando houver estado de erro.
- Permitir definição de nome para integração com formulários.
- Exibir indicador visual de carregamento quando necessário.

# Constraints
- Deve apresentar entre 2 e 5 opções, não mais nem menos.
- Apenas uma opção pode estar selecionada ao mesmo tempo.
- Não deve permitir seleção múltipla.
- Não deve permitir alteração quando em estado somente leitura ou desabilitado.
- Não deve emitir evento de mudança se a seleção não for alterada.
- Deve impedir interação quando em estado de carregamento.
- Deve exibir indicação visual clara para estados de erro, desabilitado, obrigatório e carregamento.

# Notes
- O componente deve ser responsivo, adaptando o layout para diferentes larguras.
- O espaçamento entre botões deve ser consistente e agradável visualmente.
`;

