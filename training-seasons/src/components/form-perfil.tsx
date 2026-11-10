"use client";

import { useActionState } from "react";
import { salvarPerfil } from "@/app/perfil/actions";
import type { EstadoForm } from "@/lib/estado-form";
import { BotaoEnviar, Campo } from "./form-auth";

export type PerfilInicial = {
  nome: string;
  altura: string;
  pesoInicial: string;
  meta: string;
  prazo: string;
};

export function FormPerfil({
  inicial,
  hoje,
  voltarAoPainel,
}: {
  inicial: PerfilInicial;
  hoje: string;
  /** true na página de Perfil (depois de salvar, vai ao painel); false no primeiro acesso, que já acontece no painel. */
  voltarAoPainel: boolean;
}) {
  const [estado, formAction] = useActionState(salvarPerfil, {} as EstadoForm);
  // Depois de um erro, mostra o que a pessoa tinha digitado (o React limpa o formulário).
  const v = { ...inicial, ...estado.valores };

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {estado.erro && (
        <p
          role="alert"
          className="rounded-xl border-2 border-accent bg-surface p-3 text-sm font-medium"
        >
          {estado.erro}
        </p>
      )}
      {voltarAoPainel && <input type="hidden" name="voltar" value="1" />}
      <Campo
        rotulo="Nome"
        name="nome"
        type="text"
        autoComplete="given-name"
        maxLength={60}
        defaultValue={v.nome}
        required
      />
      <Campo
        rotulo="Altura (cm)"
        name="altura"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        defaultValue={v.altura}
        dica="Ex: 170"
        required
      />
      <Campo
        rotulo="Peso inicial (kg)"
        name="pesoInicial"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        defaultValue={v.pesoInicial}
        dica="Seu peso hoje, ao começar. Ex: 82,5"
        required
      />
      <Campo
        rotulo="Meta de peso (kg)"
        name="meta"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        defaultValue={v.meta}
        dica="O peso que você quer alcançar. Ex: 75"
        required
      />
      <Campo
        rotulo="Prazo da meta (opcional)"
        name="prazo"
        type="date"
        min={hoje}
        defaultValue={v.prazo}
        dica="Se não tiver pressa, deixe em branco."
      />
      <BotaoEnviar>Salvar</BotaoEnviar>
    </form>
  );
}
