import type { Metadata } from "next";
import { Suspense } from "react";
import { CabecalhoPrivado } from "@/components/cabecalho-privado";
import { FormPerfil } from "@/components/form-perfil";
import { perfilCompleto, perfilParaFormulario } from "@/lib/perfil";
import { hojeNoBrasil } from "@/lib/semana";
import { usuarioAtual } from "@/lib/supabase/usuario";

export const metadata: Metadata = { title: "Perfil" };

export default function PerfilPage() {
  return (
    <div className="flex flex-1 flex-col">
      <CabecalhoPrivado />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="text-muted">Carregando…</p>}>
          <Conteudo />
        </Suspense>
      </main>
    </div>
  );
}

async function Conteudo() {
  const { supabase, user } = await usuarioAtual();

  // O banco só devolve a ficha da própria pessoa (RLS).
  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome, altura_cm, peso_inicial_kg, meta_peso_kg, meta_prazo")
    .maybeSingle();

  const completo = perfilCompleto(perfil);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {completo ? "Seu perfil" : "Vamos começar!"}
        </h1>
        <p className="text-muted">
          {completo
            ? "Atualize seus dados e sua meta quando quiser."
            : "Conte um pouco sobre você e defina sua meta. Dá pra mudar depois."}
        </p>
      </div>
      <FormPerfil
        hoje={hojeNoBrasil()}
        voltarAoPainel
        inicial={perfilParaFormulario(
          perfil,
          (user.user_metadata?.nome as string | undefined) || "",
        )}
      />
    </>
  );
}
