/// <mls fileReference="_102020_/l2/molecules/groupEnterTimeInterval/workShiftMolecule.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterTimeInterval';
export const skill = `# Metadata
- TagName: molecules--group-enter-time-interval--work-shift-molecule-102020

# Objective
Permitir que o usuário configure um intervalo de turno de trabalho apenas com hora inicial e hora final, incluindo suporte opcional a turnos que atravessam a meia-noite, validação configurável e emissão de eventos de interação e mudança.

# Responsibilities
- Exibir dois campos de entrada/seleção de tempo: hora inicial e hora final, sem componente de data.
- Permitir definir e atualizar um intervalo de tempo com base nos valores de hora inicial e hora final.
- Representar e aceitar intervalos que atravessam a meia-noite quando a permissão de “overnight” estiver ativada.
- Fornecer um valor de saída normalizado do intervalo contendo, no mínimo, start (HH:mm), end (HH:mm) e um indicador de overnight (boolean) ou equivalente inferível.
- Aplicar granularidade mínima configurável (step, em minutos) às entradas/seleções de tempo.
- Aplicar limites configuráveis de horário mínimo e máximo permitidos para ambos os campos.
- Validar preenchimento obrigatório quando required=true, exigindo start e end.
- Validar formato e faixa de horário (HH:mm dentro de 00:00–23:59), indicando erro quando inválido.
- Validar consistência do intervalo, incluindo impedir/indicar erro para duração zero (start == end) quando não permitido.
- Validar duração mínima e/ou máxima do turno quando configuradas, considerando corretamente intervalos overnight quando permitidos.
- Permitir limpar o intervalo (torná-lo vazio/nulo) por ação do usuário quando required=false.
- Manter sincronização entre o valor recebido externamente e o que é exibido; ao receber novo valor, atualizar a apresentação sem exigir interação do usuário.
- Emitir evento de mudança quando um intervalo válido for alterado por ação do usuário, incluindo no detail o valor normalizado completo e, quando aplicável, durationMinutes.
- Emitir evento incremental de edição durante alterações, incluindo no detail os valores atuais, um indicador de validade e informações de erro quando existirem.
- Emitir evento de blur quando o componente (como um todo) perder foco.
- Expor e refletir estado de erro via propriedade error (boolean|string), apresentando mensagem quando for string.
- Quando a validação interna detectar erro, refletir visualmente o estado inválido e disponibilizar informações de erro nos eventos emitidos.
- Suportar propriedade name para integração com formulários/serialização, associando-a ao valor do intervalo.
- Indicar visualmente quando o intervalo configurado é overnight (quando aplicável).
- Apresentar placeholders configuráveis para campos vazios e manter consistência de formatação em HH:mm.
- Apresentar estados visuais distintos para normal, foco, hover (quando aplicável), disabled, readonly e loading.
- Exibir feedback de validação destacando campos inválidos e exibindo mensagem de erro quando aplicável.
- Manter legibilidade e usabilidade em diferentes larguras de container, acomodando rótulos e mensagens de erro.

# Constraints
- Quando disabled=true:
  - Deve bloquear interações do usuário.
  - Não deve emitir eventos de mudança por ação do usuário.
- Quando readonly=true:
  - Deve exibir os valores.
  - Deve impedir alteração por ação do usuário.
  - Não deve emitir eventos de mudança por ação do usuário.
- Quando loading=true:
  - Deve indicar estado de carregamento.
  - Deve impedir interação do usuário enquanto o estado estiver ativo.
- Quando overnight não for permitido:
  - Deve tratar end < start como inválido.
- Quando overnight for permitido:
  - Deve considerar end < start como um intervalo overnight válido.
- Deve rejeitar/indicar erro para horários fora de 00:00–23:59 e para formatos que não correspondam ao esperado.
- Deve aplicar step e limites mínimo/máximo de horário às entradas/seleções em ambos os campos.
- Deve impedir/indicar erro para intervalo de duração zero quando a configuração não permitir.
- Deve considerar corretamente intervalos overnight ao avaliar duração mínima e máxima, quando tais restrições estiverem configuradas.
- Não deve forçar um valor inicial quando nenhum valor externo for fornecido, exceto quando um valor padrão tiver sido explicitamente configurado.

# Notes
- O indicador de overnight pode ser fornecido explicitamente no valor de saída ou ser inferível a partir de start/end conforme as regras configuradas.
- Eventos incrementais podem ocorrer com valores incompletos; nesses casos, o detail deve indicar validade e expor os campos atuais para suportar validação e reações do consumidor.`;

