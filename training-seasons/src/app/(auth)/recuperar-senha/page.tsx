import type { Metadata } from "next";
import Link from "next/link";
import { BotaoEnviar, Campo, Formulario } from "@/components/form-auth";
import { recuperarSenha } from "../actions";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Esqueceu a senha?</h1>
        <p className="text-muted">
          Sem problema. Informe seu e-mail e enviamos um link para criar uma nova.
        </p>
      </div>

      <Formulario action={recuperarSenha}>
        <Campo
          rotulo="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
        <BotaoEnviar>Enviar link</BotaoEnviar>
      </Formulario>

      <Link href="/entrar" className="text-sm font-semibold underline">
        Voltar para entrar
      </Link>
    </>
  );
}
