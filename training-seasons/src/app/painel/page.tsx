import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { sair } from "../(auth)/actions";

export const metadata: Metadata = { title: "Painel" };

export default function PainelPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="w-full border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight">
            Training Seasons
          </span>
          <form action={sair}>
            <button
              type="submit"
              className="min-h-11 rounded-xl border-2 border-border px-4 text-sm font-semibold"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-10 sm:px-6">
        {/* O crachá é lido a cada visita, então fica atrás de uma tela de carregamento */}
        <Suspense fallback={<p className="text-muted">Carregando…</p>}>
          <Boasvindas />
        </Suspense>
      </main>
    </div>
  );
}

async function Boasvindas() {
  if (!getSupabaseConfig()) redirect("/entrar");

  const supabase = await createClient();
  // Checagem DEFINITIVA: pergunta ao Supabase se o crachá é válido.
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");

  // Lê a ficha da própria pessoa. O banco só devolve a ficha dela (RLS).
  const { data: perfil } = await supabase
    .from("perfis")
    .select("nome")
    .maybeSingle();

  const nome =
    perfil?.nome || (data.user.user_metadata?.nome as string | undefined) || "";

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Olá{nome ? `, ${nome}` : ""}!
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Sua conta está ativa. Em breve você vai registrar seu peso e começar a
        sua primeira temporada por aqui.
      </p>
    </>
  );
}
