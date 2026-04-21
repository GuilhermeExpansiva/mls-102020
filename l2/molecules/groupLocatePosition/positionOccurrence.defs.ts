/// <mls fileReference="_102020_/l2/molecules/groupLocatePosition/positionOccurrence.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupLocatePosition';
export const skill = `# Metadata
- TagName: molecules--group-locate-position--position-occurrence-102020

# Objective
Permitir ao usuário selecionar e visualizar a localização de uma ocorrência, utilizando o GPS do dispositivo para capturar a posição atual e exibindo essa posição em um mapa interativo.

# Responsibilities
- Permitir ao usuário marcar a localização de uma ocorrência.
- Oferecer opção para capturar a localização atual utilizando o GPS do dispositivo.
- Exibir a posição selecionada em um mapa interativo.
- Permitir ao usuário visualizar a localização selecionada antes de confirmar.
- Permitir ajuste manual da posição no mapa.
- Emitir evento ao selecionar ou alterar a localização, informando latitude, longitude e endereço (quando disponível).
- Permitir inicialização com uma localização pré-definida, se fornecida.
- Indicar visualmente quando a localização está sendo obtida via GPS.
- Permitir ao usuário remover ou redefinir a localização selecionada.

# Constraints
- A localização só pode ser confirmada após seleção ou captura válida.
- O componente deve impedir múltiplas solicitações simultâneas de localização via GPS.
- O usuário não pode confirmar uma localização enquanto a captura via GPS estiver em andamento.
- O componente deve exibir mensagem de erro caso a obtenção da localização via GPS falhe.
- O componente deve aceitar apenas coordenadas válidas para seleção ou inicialização.
- O componente deve sempre refletir visualmente o estado atual da seleção (selecionada, carregando, erro, removida).

# Notes
- A seleção manual deve ser possível mesmo sem acesso ao GPS.
- O endereço pode ser exibido quando disponível, mas não é obrigatório para confirmação da seleção.`;

