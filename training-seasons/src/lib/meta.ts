// Quanto falta para a meta, funcionando tanto para quem quer perder quanto para quem quer ganhar peso.
// A direção é definida comparando o peso inicial com a meta.

const arredondar = (n: number) => Math.round(n * 10) / 10;

export function faltaParaMeta(inicial: number, atual: number, meta: number) {
  if (meta < inicial) {
    // quer perder peso
    return { atingida: atual <= meta, falta: arredondar(Math.max(atual - meta, 0)) };
  }
  if (meta > inicial) {
    // quer ganhar peso
    return { atingida: atual >= meta, falta: arredondar(Math.max(meta - atual, 0)) };
  }
  // meta = manter o peso
  return { atingida: arredondar(atual) === meta, falta: arredondar(Math.abs(atual - meta)) };
}
