/// <mls fileReference="_102020_/l2/molecules/groupShowProgress/progressRing.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';
export const skill = `# Metadata
- TagName: molecules--group-show-progress--progress-ring-102020

# Objective
Exibir visualmente o andamento da geração de relatórios por meio de um anel circular de progresso, suportando modos determinado e indeterminado.

# Responsibilities
- Exibir o progresso de uma operação em formato de anel circular.
- Permitir alternância entre modo determinado (percentual conhecido) e indeterminado (progresso desconhecido).
- Permitir exibição opcional de valor percentual ou texto centralizado no anel.
- Aceitar propriedades para controlar valor do progresso, estado indeterminado, tamanho do anel e estado desabilitado.
- Emitir evento ao atingir 100% de progresso.
- Fornecer informações de progresso acessíveis para tecnologias assistivas.

# Constraints
- O valor de progresso no modo determinado deve estar entre 0 e 100.
- No modo indeterminado, não deve exibir valor percentual fixo.
- O componente deve apresentar estados visuais distintos para ativo, completo (100%), desabilitado e indeterminado.
- Não deve permitir valores fora do intervalo permitido no modo determinado.
- O texto ou número centralizado é opcional e deve ser configurável.
- Deve garantir acessibilidade, incluindo informações relevantes para leitores de tela.

# Notes
- O componente deve ser visualmente neutro para se adaptar a diferentes contextos de relatórios.
`;

