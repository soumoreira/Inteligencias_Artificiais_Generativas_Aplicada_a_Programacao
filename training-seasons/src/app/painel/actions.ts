"use server";

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

export async function registrarPeso(
  _: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const { supabase, user } = await usuarioAtual();

  const valores = {
    data: texto(formData, "data"),
    peso: texto(formData, "peso"),
    observacao: texto(formData, "observacao"),
  };
  const erro = (mensagem: string): EstadoForm => ({ erro: mensagem, valores });

  if (!dataValida(valores.data)) return erro("Escolha uma data válida.");
  if (valores.data > hojeNoBrasil()) {
    return erro("Não dá pra registrar uma data futura. Escolha hoje ou um dia anterior.");
  }

  const peso = lerNumero(valores.peso);
  if (peso === null || peso < 20 || peso > 500) {
    return erro("Peso entre 20 e 500 kg, com no máximo 1 casa decimal (ex: 82,5).");
  }

  if (valores.observacao.length > 280) {
    return erro("A observação pode ter no máximo 280 caracteres.");
  }

  // Um registro por semana: se já existe, atualiza (o banco também garante isso).
  const { error } = await supabase.from("registros_peso").upsert(
    {
      user_id: user.id,
      semana: segundaDaSemana(valores.data),
      peso_kg: peso,
      observacao: valores.observacao || null,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "user_id,semana" },
  );
  if (error) return erro("Não foi possível salvar agora. Tente novamente em instantes.");

  revalidatePath("/painel");
  return { sucesso: "Peso salvo!" };
}

export async function excluirRegistro(formData: FormData) {
  const { supabase } = await usuarioAtual();

  const id = texto(formData, "id");
  // Só aceitamos um identificador no formato de UUID.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return;

  // O RLS garante que só dá pra apagar registros da própria pessoa.
  await supabase.from("registros_peso").delete().eq("id", id);
  revalidatePath("/painel");
}
