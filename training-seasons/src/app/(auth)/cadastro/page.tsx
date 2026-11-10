import type { Metadata } from "next";
import Link from "next/link";
import { BotaoEnviar, Campo, Formulario } from "@/components/form-auth";
import { cadastrar } from "../actions";

export const metadata: Metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-muted">
          Leva menos de um minuto. Seus dados são só seus: ninguém mais vê o seu
          peso.
        </p>
      </div>

      <Formulario action={cadastrar}>
        <Campo
          rotulo="Nome"
          name="nome"
          type="text"
          autoComplete="given-name"
          minLength={2}
          maxLength={60}
          required
        />
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
          autoComplete="new-password"
          minLength={8}
          dica="Pelo menos 8 caracteres."
          required
        />
        <Campo
          rotulo="Repita a senha"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="maior18"
            required
            className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--ts-azul)]"
          />
          <span>Confirmo que tenho 18 anos ou mais.</span>
        </label>
        <BotaoEnviar>Criar conta</BotaoEnviar>
      </Formulario>

      <p className="text-sm">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
