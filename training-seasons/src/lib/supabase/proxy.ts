import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

// Áreas que exigem login e páginas que só fazem sentido para quem NÃO está logado.
const ROTAS_PRIVADAS = ["/painel"];
const ROTAS_SO_VISITANTE = ["/entrar", "/cadastro"];

function redirecionar(request: NextRequest, destino: string, base: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = destino;
  url.search = "";
  const resposta = NextResponse.redirect(url);
  // Preserva o crachá renovado, se houve renovação nesta requisição.
  base.cookies.getAll().forEach((c) => resposta.cookies.set(c));
  return resposta;
}

// Roda antes de cada página: renova o crachá (sessão) e faz a checagem rápida de acesso.
export async function updateSession(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const config = getSupabaseConfig();
  if (!config) return resposta; // sem Supabase configurado, não há login a verificar

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          resposta.cookies.set(name, value, options),
        );
      },
    },
  });

  // Checagem rápida (valida a assinatura do crachá). A checagem definitiva
  // acontece dentro das páginas/ações privadas, perguntando ao Supabase.
  const { data } = await supabase.auth.getClaims();
  const logado = Boolean(data?.claims);
  const caminho = request.nextUrl.pathname;

  if (!logado && ROTAS_PRIVADAS.some((r) => caminho.startsWith(r))) {
    return redirecionar(request, "/entrar", resposta);
  }
  if (logado && ROTAS_SO_VISITANTE.includes(caminho)) {
    return redirecionar(request, "/painel", resposta);
  }

  return resposta;
}
