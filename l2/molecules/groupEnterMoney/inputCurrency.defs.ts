/// <mls fileReference="_102020_/l2/molecules/groupEnterMoney/inputCurrency.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterMoney';
export const skill = `# Metadata
- TagName: molecules--group-enter-money--input-currency-102020

# Objective
Permitir ao usuário inserir valores monetários com formatação automática conforme moeda e locale definidos, garantindo entrada e exibição amigáveis e consistentes para operações financeiras.

# Responsibilities
- Permitir a digitação de valores monetários com suporte a casas decimais e separadores de milhar.
- Formatar automaticamente o valor exibido conforme o locale e moeda definidos.
- Exibir o símbolo da moeda de acordo com a configuração recebida.
- Aceitar propriedades para definir o locale e o código da moeda.
- Permitir configuração do número mínimo e máximo de casas decimais.
- Permitir configuração de valor mínimo e máximo aceito.
- Permitir estado desabilitado e somente leitura.
- Permitir exibição de mensagem de erro e estado de validação.
- Disparar evento de alteração ao modificar o valor.
- Disparar evento de perda de foco ao sair do campo.
- Permitir valor inicial via propriedade.
- Permitir configuração de placeholder.
- Permitir estado de carregamento.
- Permitir marcação de campo obrigatório.

# Constraints
- O valor inserido deve respeitar o formato da moeda e locale definidos.
- Não deve aceitar valores fora dos limites mínimo e máximo configurados.
- Não deve permitir edição quando estiver em estado desabilitado ou somente leitura.
- Deve exibir mensagem de erro apenas quando houver erro de validação.
- O símbolo da moeda deve ser exibido conforme o locale e moeda configurados.
- O campo deve indicar visualmente quando estiver em estado de erro, desabilitado, somente leitura, carregando ou obrigatório.
- O placeholder deve ser exibido apenas quando o campo estiver vazio.

# Notes
- A formatação deve ser atualizada em tempo real durante a digitação.
- O símbolo da moeda pode aparecer antes ou depois do valor, conforme o locale.
`;

