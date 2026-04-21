/// <mls fileReference="_102020_/l2/molecules/groupRateItem/rateStars.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: molecules--group-rate-item--rate-stars-102020

# Objective
Permitir que o usuário avalie algo selecionando uma nota inteira de 1 a 5, utilizando uma interface visual de estrelas.

# Responsibilities
- Exibir visualmente 5 estrelas representando as opções de nota.
- Permitir ao usuário selecionar uma nota inteira entre 1 e 5 clicando em qualquer estrela.
- Destacar visualmente as estrelas selecionadas e todas as anteriores à nota escolhida.
- Permitir alterar a nota selecionada a qualquer momento, enquanto não estiver desabilitado ou em modo somente leitura.
- Permitir limpar a seleção, caso a nota não seja obrigatória.
- Emitir um evento de alteração ao selecionar uma nova nota, informando o valor selecionado.
- Permitir navegação e seleção por teclado (setas esquerda/direita, espaço, enter).
- Emitir evento de perda de foco (blur) ao perder o foco.
- Permitir estado desabilitado, impedindo qualquer interação do usuário.
- Permitir estado somente leitura, exibindo o valor sem permitir alterações.
- Permitir exibir estado de erro, com indicação visual e mensagem de erro quando fornecida.
- Permitir exibir estado obrigatório, indicando visualmente que o campo é requerido.
- Permitir exibir estado de carregamento, desabilitando interações enquanto estiver ativo.
- Aceitar valor inicial (nota já selecionada).
- Aceitar nome para integração com formulários.

# Constraints
- Sempre exibir exatamente 5 estrelas, representando as opções de nota de 1 a 5.
- O valor mínimo permitido é 1, o máximo é 5, e o passo é 1.
- Não permitir seleção de valores fora do intervalo de 1 a 5.
- Não permitir interação quando estiver desabilitado, em modo somente leitura ou carregando.
- O campo pode ser obrigatório ou opcional, conforme configuração.
- Deve ser responsivo, adaptando o layout para diferentes larguras de tela.
- Deve garantir acessibilidade, incluindo contraste adequado, foco visível e suporte a leitores de tela (labels, aria).

# Notes
- O destaque visual ao passar o mouse sobre as estrelas deve indicar qual nota será selecionada.
- A indicação visual dos estados (erro, obrigatório, desabilitado, somente leitura, carregando) deve ser clara e perceptível.
`;

