/// <mls fileReference="_102020_/l2/molecules/groupRateItem/npsScale.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: molecules--group-rate-item--nps-scale-102020

# Objective
Permitir que o usuário avalie um item, serviço ou experiência selecionando uma nota única de 0 a 10 em uma escala NPS (Net Promoter Score).

# Responsibilities
- Exibir uma escala de seleção com opções de 0 a 10.
- Permitir seleção de apenas uma opção por vez.
- Aceitar e exibir um valor inicial definido.
- Emitir um evento de mudança ao selecionar uma nova nota.
- Suportar estado desabilitado, impedindo qualquer interação.
- Suportar estado somente leitura, exibindo a seleção sem permitir alteração.
- Exibir mensagens auxiliares, como descrição ou instrução, quando fornecidas.
- Indicar visualmente estados de erro e obrigatório.
- Permitir navegação e seleção por teclado (tab, setas, enter/space).
- Emitir evento ao perder o foco (blur).
- Permitir customização de rótulos laterais (ex: "Nada provável" e "Muito provável").

# Constraints
- O valor selecionado deve ser um número inteiro entre 0 e 10.
- Não permitir seleção múltipla.
- Quando desabilitado ou somente leitura, não deve permitir alteração do valor.
- Deve ser possível definir o componente como obrigatório.
- Deve ser possível exibir mensagens de erro quando necessário.
- Mensagens auxiliares e rótulos laterais devem ser exibidos apenas se fornecidos.
- Deve ser acessível para navegação e seleção por teclado.
- Não deve permitir estados inválidos, como valores fora do intervalo permitido.

# Notes
- O componente deve ser responsivo e manter legibilidade em diferentes larguras.
- Deve fornecer feedback visual ao passar o mouse ou navegar com teclado sobre as opções.`;

