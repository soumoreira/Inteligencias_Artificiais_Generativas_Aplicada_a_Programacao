"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { usuarioAtual } from "@/lib/supabase/usuario";
import type { EstadoForm } from "@/lib/estado-form";
import {
  dataValida,
  hojeNoBrasil,
  lerNumero,
  segundaDaSemana,
} from "@/lib/semana";

function texto(formData: FormData, campo: string) {
  const v = formData.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

export async function salvarPerfil(
  _: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const { supabase, user } = await usuarioAtual();

  const valores = {
    nome: texto(formData, "nome"),
    altura: texto(formData, "altura"),
    pesoInicial: texto(formData, "pesoInicial"),
    meta: texto(formData, "meta"),
    prazo: texto(formData, "prazo"),
  };
  const erro = (mensagem: string): EstadoForm => ({ erro: mensagem, valores });

  if (valores.nome.length < 2 || valores.nome.length > 60) {
    return erro("Informe seu nome (entre 2 e 60 caracteres).");
  }

  const altura = lerNumero(valores.altura);
  if (altura === null || !Number.isInteger(altura) || altura < 100 || altura > 250) {
    return erro("Altura em centímetros, entre 100 e 250 (ex: 170).");
  }

  const pesoInicial = lerNumero(valores.pesoInicial);
  if (pesoInicial === null || pesoInicial < 20 || pesoInicial > 500) {
    return erro("Peso inicial entre 20 e 500 kg, com no máximo 1 casa decimal (ex: 82,5).");
  }

  const meta = lerNumero(valores.meta);
  if (meta === null || meta < 20 || meta > 500) {
    return erro("Meta de peso entre 20 e 500 kg, com no máximo 1 casa decimal (ex: 75).");
  }

  let prazo: string | null = null;
  if (valores.prazo) {
    if (!dataValida(valores.prazo)) return erro("O prazo da meta não é uma data válida.");
    if (valores.prazo <= hojeNoBrasil()) {
      return erro("O prazo da meta precisa ser uma data futura (ou deixe em branco).");
    }
    prazo = valores.prazo;
  }

  const { data: atualizados, error } = await supabase
    .from("perfis")
    .update({
      nome: valores.nome,
      altura_cm: altura,
      peso_inicial_kg: pesoInicial,
      meta_peso_kg: meta,
      meta_prazo: prazo,
    })
    .eq("id", user.id)
    .select("id");

  if (error) return erro("Não foi possível salvar agora. Tente novamente em instantes.");
  if (!atualizados || atualizados.length === 0) {
    return erro(
      "Não encontramos o seu perfil. Saia e entre de novo; se persistir, avise o administrador.",
    );
  }

  // Primeira vez: o peso inicial vira o primeiro ponto do histórico.
  const { count } = await supabase
    .from("registros_peso")
    .select("id", { count: "exact", head: true });
  if (count === 0) {
    await supabase.from("registros_peso").insert({
      user_id: user.id,
      semana: segundaDaSemana(hojeNoBrasil()),
      peso_kg: pesoInicial,
      observacao: "Peso inicial",
    });
  }

  revalidatePath("/painel");
  revalidatePath("/perfil");

  // Vindo da página de Perfil, leva ao painel. No primeiro acesso (formulário dentro do
  // painel) não há para onde ir: a própria página se atualiza e passa a mostrar o painel.
  if (formData.get("voltar") === "1") redirect("/painel");
  return {};
}
