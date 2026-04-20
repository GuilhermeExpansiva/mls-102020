/// <mls fileReference="_102020_/l2/molecules/groupEnterText/textareaWithCounter.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';
export const skill = `# Metadata
- TagName: molecules--group-enter-text--textarea-with-counter-102020

# Objective
Permitir que o usuário insira e edite descrições longas em uma área de texto, exibindo dinamicamente a contagem de caracteres digitados e respeitando limites definidos.

# Responsibilities
- Permitir inserção e edição de texto livre em múltiplas linhas.
- Exibir a contagem de caracteres digitados de forma dinâmica.
- Permitir configuração de um limite máximo de caracteres.
- Impedir a digitação além do limite máximo de caracteres, se definido.
- Disparar evento de mudança sempre que o texto for alterado.
- Permitir estados desabilitado e somente leitura.
- Permitir exibição de mensagem de erro e estado obrigatório.
- Permitir configuração de valor inicial, nome do campo e placeholder.
- Disparar evento ao perder o foco.

# Constraints
- Não permitir inserção de caracteres além do limite máximo, caso definido.
- O contador de caracteres deve ser sempre visível ao usuário.
- O formato do contador deve ser 'X/Y' quando houver limite, ou apenas 'X' se não houver.
- O campo deve indicar visualmente quando o limite de caracteres for atingido.
- Mensagem de erro deve ser exibida apenas quando configurada.
- Os estados desabilitado, somente leitura e obrigatório devem ser indicados visualmente e respeitados funcionalmente.
- O placeholder deve ser exibido apenas quando o campo estiver vazio.

# Notes
- O evento de mudança deve ser disparado para qualquer alteração no texto.
- O evento de perda de foco deve ser disparado ao sair do campo.
`;

