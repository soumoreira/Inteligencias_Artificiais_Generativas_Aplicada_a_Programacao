// Resposta padrão das ações dos formulários do app.
// "valores" devolve de volta o que a pessoa digitou quando há erro
// (o React limpa o formulário depois de cada envio).
export type EstadoForm = {
  erro?: string;
  sucesso?: string;
  valores?: Record<string, string>;
};
