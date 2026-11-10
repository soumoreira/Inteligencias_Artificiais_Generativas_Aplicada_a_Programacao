import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./server";
import { getSupabaseConfig } from "./config";

// Devolve o cliente do Supabase + a pessoa logada, ou manda para a tela de entrar.
// Usa getUser(): pergunta ao Supabase se o crachá é válido (checagem definitiva).
export async function usuarioAtual() {
  // O Supabase olha o relógio (Date.now) para ver se o crachá venceu. O Next.js não aceita
  // isso nos "ensaios" de pré-carregamento de links; connection() avisa que esta parte só
  // pode rodar quando a pessoa realmente pede a página.
  await connection();
  if (!getSupabaseConfig()) redirect("/entrar");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");
  return { supabase, user: data.user };
}
