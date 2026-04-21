/// <mls fileReference="_102020_/l2/molecules/groupRateItem/emojiSatisfaction.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: molecules--group-rate-item--emoji-satisfaction-102020

# Objective
Permitir que o usuário avalie sua satisfação com o atendimento selecionando um emoji que representa seu nível de satisfação.

# Responsibilities
- Exibir uma lista de opções de avaliação representadas por emojis.
- Permitir que o usuário selecione apenas uma opção de emoji por vez.
- Registrar o valor selecionado como um número correspondente à opção escolhida.
- Permitir configuração das opções de emoji por meio de propriedades ou slots.
- Emitir um evento de mudança ao selecionar uma opção, incluindo o valor selecionado.
- Permitir ativação dos estados desabilitado e somente leitura, impedindo interação quando ativos.
- Permitir exibição de mensagem de erro e estado obrigatório.
- Permitir configuração de valor inicial e nome para integração com formulários.
- Permitir exibição de estado de carregamento, desabilitando interações enquanto ativo.
- Permitir navegação e seleção por teclado.
- Emitir evento de perda de foco quando o componente perde o foco.

# Constraints
- Apenas uma opção de emoji pode ser selecionada por vez.
- Quando desabilitado ou em modo somente leitura, não deve permitir interação do usuário.
- Quando em estado de carregamento, todas as interações devem ser bloqueadas.
- O valor selecionado deve ser sempre um número válido correspondente a uma das opções exibidas.
- Mensagem de erro só deve ser exibida se houver erro configurado.
- O componente deve ser acessível por teclado e indicar visualmente o foco.
- Não deve permitir seleção de opções fora do intervalo configurado.

# Notes
- As opções de emoji e seus rótulos podem ser personalizadas.
- O componente pode exibir rótulo ou legenda opcional, se fornecido.
- Pode exibir tooltip ou descrição acessível para cada emoji, se configurado.`;

