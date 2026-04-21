/// <mls fileReference="_102020_/l2/molecules/groupRateItem/rateHearts.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: molecules--group-rate-item--rate-hearts-102020

# Objective
Permitir que o usuário avalie algo selecionando uma nota por meio de ícones de corações, com suporte a diferentes estados e opções customizadas.

# Responsibilities
- Permitir ao usuário selecionar uma nota utilizando ícones de coração.
- Garantir que o valor selecionado seja sempre um número inteiro dentro do intervalo permitido.
- Exibir visualmente o valor selecionado por meio de corações preenchidos e vazios.
- Permitir configuração da quantidade mínima, máxima e do passo para o número de corações exibidos.
- Aceitar opções customizadas para cada coração (como rótulos ou emojis) via Slot Tag Item.
- Suportar os estados: desabilitado, somente leitura, obrigatório, erro e carregando.
- Permitir limpar a seleção, exceto quando o campo for obrigatório.
- Aceitar valor inicial definido pelo usuário.
- Emitir evento de mudança ao selecionar um valor.
- Emitir evento de perda de foco quando o componente perde o foco.
- Suportar acessibilidade, incluindo navegação por teclado, foco e descrições acessíveis.

# Constraints
- O valor selecionado deve sempre respeitar os limites mínimo e máximo definidos.
- Não deve permitir interação quando estiver desabilitado ou em modo somente leitura.
- Não deve permitir limpar a seleção se o campo for obrigatório.
- Deve indicar visualmente os estados: desabilitado, somente leitura, obrigatório, erro e carregando.
- Deve garantir que apenas valores válidos possam ser selecionados.
- Deve garantir que opções customizadas não quebrem a experiência de avaliação.
- Deve garantir que a seleção seja clara e facilmente compreendida pelo usuário.

# Notes
- O componente deve ser responsivo e se adaptar ao espaço disponível.
- A personalização visual dos corações deve ser possível sem comprometer a funcionalidade.
`;

