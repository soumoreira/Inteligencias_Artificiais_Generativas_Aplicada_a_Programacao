import type { PerfilInicial } from "@/components/form-perfil";

type LinhaPerfil = {
  nome?: string | null;
  altura_cm?: number | null;
  peso_inicial_kg?: number | string | null;
  meta_peso_kg?: number | string | null;
  meta_prazo?: string | null;
} | null;

const kg = (n: number | string | null | undefined) =>
  n == null ? "" : String(n).replace(".", ",");

/** O perfil só está completo quando altura, peso inicial e meta foram informados. */
export function perfilCompleto(perfil: LinhaPerfil): boolean {
  return Boolean(perfil?.altura_cm && perfil?.peso_inicial_kg && perfil?.meta_peso_kg);
}

/** Converte a linha do banco nos textos que aparecem nos campos do formulário. */
export function perfilParaFormulario(perfil: LinhaPerfil, nomePadrao: string): PerfilInicial {
  return {
    nome: perfil?.nome || nomePadrao,
    altura: perfil?.altura_cm ? String(perfil.altura_cm) : "",
    pesoInicial: kg(perfil?.peso_inicial_kg),
    meta: kg(perfil?.meta_peso_kg),
    prazo: perfil?.meta_prazo ?? "",
  };
}
