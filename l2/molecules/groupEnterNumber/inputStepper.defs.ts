/// <mls fileReference="_102020_/l2/molecules/groupEnterNumber/inputStepper.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterNumber';
export const skill = `# Metadata
- TagName: molecules--group-enter-number--input-stepper-102020

# Objective
Permitir ao usuário selecionar e ajustar um valor numérico inteiro utilizando controles de incremento e decremento, respeitando limites definidos e estados do campo.

# Responsibilities
- Exibir o valor numérico atual de forma clara entre os controles de incremento e decremento.
- Permitir ao usuário aumentar ou diminuir o valor utilizando botões dedicados.
- Respeitar os limites mínimo e máximo definidos para o valor.
- Aceitar e exibir um valor inicial configurável.
- Permitir atualização controlada do valor por meio de propriedade externa.
- Emitir um evento de mudança sempre que o valor for alterado pelo usuário.
- Emitir um evento ao perder o foco.
- Suportar estados desabilitado e somente leitura, impedindo qualquer alteração do valor nesses casos.
- Suportar estado de carregamento, bloqueando interações e exibindo um indicativo visual.
- Suportar exibição de erro, apresentando mensagem ou estado visual de erro quando informado.
- Permitir configuração do passo de incremento/decremento.
- Permitir configuração de nome para integração com formulários.
- Permitir marcação como campo obrigatório.

# Constraints
- O valor nunca pode ser menor que o mínimo nem maior que o máximo definidos.
- Quando desabilitado ou somente leitura, nenhuma interação do usuário pode alterar o valor.
- Quando em estado de carregamento, todas as interações devem ser bloqueadas.
- O evento de mudança só deve ser emitido quando o valor for alterado por ação do usuário.
- O evento de perda de foco só deve ser emitido quando o campo realmente perder o foco.
- O componente deve sempre refletir visualmente seus estados: erro, desabilitado, somente leitura e carregando.
- O passo de incremento/decremento deve ser respeitado em todas as alterações de valor.
- O campo obrigatório deve ser indicado quando configurado.

# Notes
- O componente pode ser utilizado em cenários como seleção de quantidade de produtos, unidades ou outros contextos que exijam ajuste rápido de valores inteiros.
`;

