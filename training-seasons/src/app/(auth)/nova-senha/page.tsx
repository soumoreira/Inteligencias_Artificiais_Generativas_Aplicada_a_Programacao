import type { Metadata } from "next";
import { BotaoEnviar, Campo, Formulario } from "@/components/form-auth";
import { definirNovaSenha } from "../actions";

export const metadata: Metadata = { title: "Nova senha" };

export default function NovaSenhaPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Crie uma nova senha</h1>
        <p className="text-muted">Escolha uma senha que só você saiba.</p>
      </div>

      <Formulario action={definirNovaSenha}>
        <Campo
          rotulo="Nova senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          minLength={8}
          dica="Pelo menos 8 caracteres."
          required
        />
        <Campo
          rotulo="Repita a nova senha"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <BotaoEnviar>Salvar nova senha</BotaoEnviar>
      </Formulario>
    </>
  );
}
