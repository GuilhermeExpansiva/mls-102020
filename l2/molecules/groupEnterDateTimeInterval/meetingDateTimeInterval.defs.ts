/// <mls fileReference="_102020_/l2/molecules/groupEnterDateTimeInterval/meetingDateTimeInterval.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterDateTimeInterval';
export const skill = `# Metadata
- TagName: molecules--group-enter-date-time-interval--meeting-date-time-interval-102020

# Objective
Permitir que o usuário defina um intervalo de data e hora de uma reunião, informando início e fim, com validações de consistência e limites, e com emissão de eventos para integração com validação e fluxos externos.

# Responsibilities
- Exibir um campo/conjunto de campos para informar data+hora de início e um campo/conjunto de campos para informar data+hora de fim.
- Exibir rótulos claros para os valores de “Início” e “Fim”.
- Aceitar valores iniciais fornecidos externamente para início e fim e refletir imediatamente esses valores na interface.
- Atualizar a interface imediatamente quando os valores de início e/ou fim forem alterados externamente.
- Permitir que o usuário edite os valores de início e fim quando o componente não estiver em modo desabilitado ou somente leitura.
- Emitir um evento de mudança quando o usuário alterar início ou fim, contendo sempre os valores atuais de início e fim.
- Emitir um evento específico quando o usuário executar a ação de limpar valores, informando que o intervalo foi limpo.
- Emitir evento de blur quando o usuário sair do campo ou do conjunto de campos do intervalo.
- Validar e expor o estado de validade do componente conforme:
  - Obrigatoriedade (quando configurada): início e fim ausentes devem tornar o componente inválido.
  - Consistência do intervalo: início não pode ser posterior ao fim.
  - Limites configurados: valores fora do mínimo/máximo configurados devem tornar o componente inválido.
- Expor indicação de erro e/ou mensagem de erro configurável e refletir o estado inválido para integração com validação externa.
- Exibir placeholders configuráveis para início e fim quando não houver valores.
- Exibir texto auxiliar opcional (ajuda) quando fornecido.
- Indicar visualmente estados de erro, desabilitado e somente leitura.
- Manter layout compacto e legível em formulários, incluindo em telas estreitas.

# Constraints
- Em estado desabilitado:
  - Deve impedir qualquer interação de edição e a ação de limpar.
  - Não deve emitir eventos de mudança nem evento de limpar.
- Em estado somente leitura:
  - Deve exibir os valores sem permitir edição nem limpar.
  - Não deve emitir eventos de mudança nem evento de limpar.
- Em estado obrigatório:
  - Deve considerar inválido quando início e/ou fim estiverem ausentes.
  - Deve expor estado de erro/invalidade de forma observável.
- Validação de consistência:
  - Deve considerar inválido quando início for posterior ao fim.
  - Não deve alterar automaticamente os valores do usuário para corrigir inconsistências.
- Limites mínimo/máximo:
  - Deve considerar inválido quando início e/ou fim estiverem fora dos limites configurados.
  - Não deve ajustar automaticamente valores para “caber” nos limites.
- Incrementos (step) de minutos/horas:
  - Deve restringir a seleção/entrada de hora para respeitar o incremento configurado.
- Emissão de eventos:
  - Eventos de mudança devem ser emitidos apenas por interação do usuário (não por atualizações externas).
  - Eventos de mudança devem incluir sempre ambos os valores (início e fim), mesmo quando apenas um deles tiver sido alterado.

# Notes
- A indicação de erro pode incluir mensagem textual e/ou sinalização visual, conforme configuração.
- O componente deve suportar placeholders distintos para início e para fim.
- O evento de blur destina-se à integração com validação externa (por exemplo, validação ao perder foco).`;

