/// <mls fileReference="_102020_/l2/molecules/groupviewchart/ml-bar-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewChart';
export const skill = `# Metadata
- TagName: groupviewchart--ml-bar-chart
# Objective
Permitir a visualização de dados em gráfico de barras com suporte a série única ou múltiplas séries, incluindo estados de carregamento e vazio, legendas, valores e acessibilidade.
# Responsibilities
- Ler dados exclusivamente pelos Slot Tags do grupo: Label, Series, Point e Empty
- Exibir barras verticais alinhadas por categoria/label
- Suportar série única com Points no nível raiz e múltiplas séries com Points dentro de Series
- Exibir o título do gráfico quando o Slot Tag Label for fornecido
- Exibir estado de carregamento quando a propriedade loading estiver ativa, substituindo o gráfico
- Exibir estado vazio quando não houver Points, usando o conteúdo do Slot Tag Empty quando presente
- Permitir alternar a legenda através da propriedade showLegend
- Exibir legenda com nome e cor de cada série quando showLegend estiver ativo e houver Series
- Exibir legenda com label e cor de cada Point quando showLegend estiver ativo e não houver Series
- Permitir alternar a exibição de valores numéricos nos pontos através da propriedade showValues
- Emitir o evento pointClick ao clicar em um ponto, com detalhes: label, value e, quando aplicável, o nome da série
- Apresentar tooltip ao passar o mouse sobre um ponto, com informações de label, value e série quando existir
- Expor alternativa acessível com tabela de dados e rótulos adequados conforme contrato do grupo
- Indicar visualmente estados de loading e empty
- Suportar cores por série (via atributo color em Series) e por ponto (via atributo color em Point)
- Apresentar modo claro e escuro com contraste adequado em textos, barras, bordas e estados interativos
# Constraints
- Deve utilizar apenas dados fornecidos pelos Slot Tags do grupo
- Não deve exibir gráfico quando loading estiver ativo
- Não deve exibir barras quando não houver Points
- A legenda só deve aparecer quando showLegend estiver ativo
- A exibição de valores numéricos só deve ocorrer quando showValues estiver ativo
- O evento pointClick deve ser emitido somente ao clicar em um ponto válido
- A tooltip deve aparecer somente ao passar o mouse sobre um ponto válido
# Notes
- O conteúdo do Slot Tag Empty deve ser exibido apenas no estado vazio
- O nome da série deve ser incluído em eventos e tooltip apenas quando houver Series`;

