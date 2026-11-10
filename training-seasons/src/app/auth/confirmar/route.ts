import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

// Só aceitamos destinos da nossa lista. Evita que alguém monte um link de e-mail
// que, depois do login, leve a pessoa para um site malicioso ("open redirect").
const DESTINOS_PERMITIDOS = ["/painel", "/nova-senha"];

const TIPOS_VALIDOS: EmailOtpType[] = [
  "signup",
  "email",
  "recovery",
  "magiclink",
  "invite",
  "email_change",
];

// É para cá que o link do e-mail (confirmação de cadastro ou recuperação de senha) aponta.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  const pedido = searchParams.get("proxima") ?? "";

  const destino = DESTINOS_PERMITIDOS.includes(pedido)
    ? pedido
    : tipo === "recovery"
      ? "/nova-senha"
      : "/painel";

  const falha = request.nextUrl.clone();
  falha.pathname = "/entrar";
  falha.search = "?erro=link";

  if (!getSupabaseConfig() || !tokenHash || !tipo || !TIPOS_VALIDOS.includes(tipo)) {
    return NextResponse.redirect(falha);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: tipo,
    token_hash: tokenHash,
  });
  if (error) return NextResponse.redirect(falha);

  const ok = request.nextUrl.clone();
  ok.pathname = destino;
  ok.search = "";
  return NextResponse.redirect(ok);
}
