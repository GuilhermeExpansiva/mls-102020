/// <mls fileReference="_102020_/l2/molecules/groupLocatePosition/mapGps.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupLocatePosition';
export const skill = `# Metadata
- TagName: molecules--group-locate-position--map-gps-102020

# Objective
Permitir ao usuário selecionar e visualizar a localização de uma ocorrência, utilizando o GPS do dispositivo e exibindo a posição em um mapa interativo.

# Responsibilities
- Permitir ao usuário capturar a localização atual utilizando o GPS do dispositivo.
- Exibir a posição selecionada em um mapa interativo para visualização.
- Permitir ao usuário confirmar ou ajustar a posição marcada no mapa.
- Exibir o endereço correspondente à posição selecionada, se disponível.
- Emitir evento ao selecionar ou alterar a localização, informando os dados de latitude, longitude e endereço em formato JSON.
- Permitir redefinir ou limpar a localização selecionada.
- Indicar visualmente quando a localização está sendo obtida.
- Permitir desabilitar ou tornar somente leitura o componente, impedindo alterações pelo usuário.
- Suportar valor inicial informado externamente (posição já definida).

# Constraints
- Não deve permitir alterações quando estiver desabilitado ou em modo somente leitura.
- Deve informar claramente ao usuário estados de carregamento, erro ou permissão negada ao tentar obter a localização.
- Deve garantir que apenas uma posição esteja selecionada por vez.
- Não deve emitir eventos de localização se não houver posição válida selecionada.
- Deve aceitar apenas valores de latitude e longitude válidos.
- Deve permitir redefinir a seleção para estado vazio.

# Notes
- O endereço exibido pode ser omitido caso não esteja disponível para a posição selecionada.
- O componente deve ser responsivo a mudanças externas no valor inicial.`;

