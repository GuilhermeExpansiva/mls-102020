/// <mls fileReference="_102020_/l2/molecules/groupviewchart/ml-pie-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewChart';
export const skill = `# Metadata
- TagName: groupviewchart--ml-pie-chart
# Objective
Exibir um gráfico de pizza que representa a distribuição de valores fornecidos por pontos, com suporte a legenda, valores, estados de carregamento e vazio, e acessibilidade do grupo.
# Responsibilities
- Ler dados exclusivamente a partir de slot tags do grupo: Label, Point, Empty e, quando aplicável, Series com Point.
- Suportar pontos no nível raiz como série única para gráfico de pizza.
- Exibir estado de carregamento quando loading=true, substituindo o gráfico.
- Exibir o conteúdo do slot Empty quando não houver pontos válidos; se não houver Empty, mostrar uma mensagem padrão de vazio.
- Exibir legenda com rótulos e cores dos pontos quando showLegend=true.
- Exibir valores numéricos associados aos pontos quando showValues=true.
- Disparar o evento pointClick ao clicar em um ponto, incluindo label, value e série quando aplicável.
- Mostrar tooltip ao passar o mouse sobre um ponto, com label, value e série quando aplicável.
- Usar o conteúdo do slot Label como rótulo acessível do gráfico.
- Disponibilizar uma representação alternativa dos dados conforme requisito de acessibilidade do grupo.
# Constraints
- Aceitar apenas pontos definidos pelos slots do grupo; ignorar outras fontes de dados.
- Quando não houver pontos válidos, não deve exibir gráfico.
- Não deve executar lógica de negócio além de apresentar os dados e interações do contrato.
- Deve manter comportamento consistente em modo claro e escuro, garantindo contraste adequado para textos e indicadores.
# Notes
- O slot Label também pode ser usado para exibir título opcional do gráfico.`;

