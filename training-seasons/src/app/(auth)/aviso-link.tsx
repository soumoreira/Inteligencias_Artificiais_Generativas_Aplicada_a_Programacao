"use client";

import { useSearchParams } from "next/navigation";

// Mostra um aviso quando o link do e-mail deu problema (veio de /auth/confirmar).
export function AvisoLink() {
  const erro = useSearchParams().get("erro");
  if (erro !== "link") return null;
  return (
    <p
      role="alert"
      className="rounded-xl border-2 border-accent bg-surface p-3 text-sm font-medium"
    >
      Esse link expirou ou já foi usado. Entre com seu e-mail e senha ou peça um
      novo link.
    </p>
  );
}
