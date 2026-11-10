// Regras de data e de número do Training Seasons.
// Todas as datas aqui são textos "AAAA-MM-DD" (sem horário), para não sofrer com fuso horário.

const MS_POR_DIA = 86_400_000;

function paraMs(iso: string): number {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return Date.UTC(ano, mes - 1, dia);
}

function paraIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Confere se o texto é uma data real, ex: "2026-02-30" não é. */
export function dataValida(iso: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) && paraIso(paraMs(iso)) === iso;
}

/** Devolve a SEGUNDA-FEIRA da semana da data informada (a semana vai de segunda a domingo). */
export function segundaDaSemana(iso: string): string {
  const ms = paraMs(iso);
  const diaDaSemana = new Date(ms).getUTCDay(); // 0 = domingo ... 6 = sábado
  const diasDesdeSegunda = (diaDaSemana + 6) % 7;
  return paraIso(ms - diasDesdeSegunda * MS_POR_DIA);
}

/** Domingo da mesma semana de uma segunda-feira. */
export function domingoDaSemana(segunda: string): string {
  return paraIso(paraMs(segunda) + 6 * MS_POR_DIA);
}

/** A data de hoje no Brasil (horário de Brasília), não no fuso do servidor. */
export function hojeNoBrasil(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(agora);
}

/** "2026-11-09" -> "09/11" */
export function diaMes(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

/** "2026-11-09" -> "09/11/2026" */
export function dataBr(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Texto da semana a partir da segunda-feira: "09/11 a 15/11". */
export function rotuloDaSemana(segunda: string): string {
  return `${diaMes(segunda)} a ${diaMes(domingoDaSemana(segunda))}`;
}

/**
 * Lê um peso/altura digitado pela pessoa. Aceita vírgula ou ponto ("72,5" ou "72.5"),
 * no máximo 1 casa decimal. Devolve null se o texto não for um número válido.
 */
export function lerNumero(texto: string): number | null {
  const limpo = texto.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d{1,3}(\.\d)?$/.test(limpo)) return null;
  return Number(limpo);
}

/** 72.5 -> "72,5 kg" */
export function formatarKg(valor: number): string {
  return `${valor.toFixed(1).replace(".", ",")} kg`;
}

/** Variação com sinal: -0.8 -> "−0,8 kg", 1.2 -> "+1,2 kg", 0 -> "0,0 kg" */
export function formatarVariacao(valor: number): string {
  const arredondado = Math.round(valor * 10) / 10;
  if (arredondado === 0) return "0,0 kg";
  const sinal = arredondado > 0 ? "+" : "−";
  return `${sinal}${Math.abs(arredondado).toFixed(1).replace(".", ",")} kg`;
}
