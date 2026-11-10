import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BotaoEnviar, Campo, Formulario } from "@/components/form-auth";
import { AvisoLink } from "../aviso-link";
import { entrar } from "../actions";

export const metadata: Metadata = { title: "Entrar" };

export default function EntrarPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Entrar</h1>
        <p className="text-muted">Bom te ver de volta. Vamos continuar a temporada?</p>
      </div>

      <Suspense>
        <AvisoLink />
      </Suspense>

      <Formulario action={entrar}>
        <Campo
          rotulo="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
        <Campo
          rotulo="Senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          required
        />
        <BotaoEnviar>Entrar</BotaoEnviar>
      </Formulario>

      <div className="flex flex-col gap-2 text-sm">
        <Link href="/recuperar-senha" className="font-semibold underline">
          Esqueci minha senha
        </Link>
        <p>
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold underline">
            Criar conta
          </Link>
        </p>
      </div>
    </>
  );
}
