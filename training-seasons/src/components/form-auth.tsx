"use client";

import { createContext, useActionState, useContext, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import type { Estado } from "@/app/(auth)/actions";

// Pequenos blocos reutilizados em todos os formulários de login/cadastro.

// Guarda o que a pessoa digitou (nome/e-mail) para repor os campos depois de um erro.
const ValoresContext = createContext<NonNullable<Estado["valores"]>>({});

export function Formulario({
  action,
  children,
}: {
  action: (estado: Estado, formData: FormData) => Promise<Estado>;
  children: React.ReactNode;
}) {
  const [estado, formAction] = useActionState(action, {} as Estado);
  const concluido = Boolean(estado.sucesso);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <ValoresContext.Provider value={estado.valores ?? {}}>
      {estado.erro && (
        <p
          role="alert"
          className="rounded-xl border-2 border-accent bg-surface p-3 text-sm font-medium"
        >
          {estado.erro}
        </p>
      )}
      {estado.sucesso && (
        <p
          role="status"
          className="rounded-xl border-2 border-primary bg-surface p-3 text-sm font-medium"
        >
          {estado.sucesso}
        </p>
      )}
      {/* Depois do sucesso, esconde os campos para não enviar duas vezes sem querer */}
      {!concluido && children}
      </ValoresContext.Provider>
    </form>
  );
}

export function Campo({
  rotulo,
  dica,
  ...props
}: { rotulo: string; dica?: string } & ComponentProps<"input">) {
  const id = props.name;
  const valores = useContext(ValoresContext);
  const anterior = id === "nome" || id === "email" ? valores[id] : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        defaultValue={anterior}
        {...props}
        // 16px evita o zoom automático do iPhone ao tocar no campo
        className="min-h-12 rounded-xl border-2 border-border bg-surface px-4 text-base"
      />
      {dica && <p className="text-sm text-muted">{dica}</p>}
    </div>
  );
}

export function BotaoEnviar({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 rounded-xl bg-primary px-6 text-base font-semibold text-on-fill disabled:opacity-60"
    >
      {pending ? "Aguarde…" : children}
    </button>
  );
}
