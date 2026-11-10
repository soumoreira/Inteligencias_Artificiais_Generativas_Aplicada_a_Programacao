import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

// Cria o "ramal telefônico" com o Supabase para usar em páginas e ações do servidor.
// Um cliente novo por requisição (nunca compartilhar entre pessoas diferentes).
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado a partir de um Server Component, onde não dá pra gravar cookies.
          // Tudo bem: o proxy já renova o crachá a cada visita.
        }
      },
    },
  });
}
