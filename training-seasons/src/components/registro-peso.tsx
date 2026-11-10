"use client";

import { useActionState, useState } from "react";
import { excluirRegistro, registrarPeso } from "@/app/painel/actions";
import type { EstadoForm } from "@/lib/estado-form";
import {
  dataBr,
  dataValida,
  formatarKg,
  formatarVariacao,
  rotuloDaSemana,
  segundaDaSemana,
} from "@/lib/semana";
import { BotaoEnviar, Campo } from "./form-auth";

export type Registro = {
  id: string;
  semana: string; // segunda-feira da semana, "AAAA-MM-DD"
  peso_kg: number;
  observacao: string | null;
};

export function RegistroPeso({
  registros,
  hoje,
}: {
  registros: Registro[]; // do mais novo para o mais antigo
  hoje: string;
}) {
  const [estado, formAction] = useActionState(registrarPeso, {} as EstadoForm);
  const [data, setData] = useState(hoje);
  // "Editando" vale só até a próxima resposta do servidor (salvou ou deu erro).
  const [edicao, setEdicao] = useState<{ registro: Registro; base: EstadoForm } | null>(null);
  const editando = edicao && edicao.base === estado ? edicao.registro : null;

  const dataEfetiva = dataValida(data) ? data : hoje;
  const semana = segundaDaSemana(dataEfetiva);
  const existente = registros.find((r) => r.semana === semana);

  const pesoPadrao = estado.valores?.peso ?? (editando ? String(editando.peso_kg).replace(".", ",") : "");
  const obsPadrao = estado.valores?.observacao ?? editando?.observacao ?? "";

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="registrar" className="flex flex-col gap-4">
        <h2 id="registrar" className="text-xl font-semibold">
          {editando ? `Editando a semana de ${rotuloDaSemana(editando.semana)}` : "Registrar peso"}
        </h2>

        <form action={formAction} className="flex flex-col gap-4" noValidate>
          {estado.erro && (
            <p role="alert" className="rounded-xl border-2 border-accent bg-surface p-3 text-sm font-medium">
              {estado.erro}
            </p>
          )}
          {estado.sucesso && (
            <p role="status" className="rounded-xl border-2 border-primary bg-surface p-3 text-sm font-medium">
              {estado.sucesso}
            </p>
          )}

          <Campo
            rotulo="Data da pesagem"
            name="data"
            type="date"
            max={hoje}
            value={data}
            onChange={(e) => setData(e.target.value)}
            dica={`Semana de ${rotuloDaSemana(semana)} (as semanas vão de segunda a domingo).`}
            required
          />

          {existente && (
            <p role="status" className="rounded-xl border-2 border-border bg-surface p-3 text-sm">
              Você já registrou <strong>{formatarKg(Number(existente.peso_kg))}</strong> nesta semana.
              Salvar vai <strong>atualizar</strong> esse valor.
            </p>
          )}

          <div key={editando?.id ?? "novo"} className="flex flex-col gap-4">
            <Campo
              rotulo="Peso (kg)"
              name="peso"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              defaultValue={pesoPadrao}
              dica="Ex: 82,5"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="observacao" className="text-sm font-semibold">
                Observação (opcional)
              </label>
              <textarea
                id="observacao"
                name="observacao"
                rows={2}
                maxLength={280}
                defaultValue={obsPadrao}
                className="rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <BotaoEnviar>{existente ? "Atualizar peso" : "Salvar peso"}</BotaoEnviar>
            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEdicao(null);
                  setData(hoje);
                }}
                className="min-h-12 rounded-xl border-2 border-border px-6 text-base font-semibold"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <section aria-labelledby="historico" className="flex flex-col gap-4">
        <h2 id="historico" className="text-xl font-semibold">
          Histórico
        </h2>

        {registros.length === 0 ? (
          <p className="text-muted">Nenhum registro ainda. Faça o primeiro acima.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {registros.map((r, i) => {
              const anterior = registros[i + 1];
              const variacao = anterior ? Number(r.peso_kg) - Number(anterior.peso_kg) : null;
              return (
                <li key={r.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="font-semibold">{rotuloDaSemana(r.semana)}</p>
                      <p className="text-sm text-muted">Semana de {dataBr(r.semana)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatarKg(Number(r.peso_kg))}</p>
                      {variacao !== null && (
                        <p className="text-sm text-muted">{formatarVariacao(variacao)} vs. anterior</p>
                      )}
                    </div>
                  </div>
                  {r.observacao && <p className="mt-2 text-sm">{r.observacao}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEdicao({ registro: r, base: estado });
                        setData(r.semana);
                      }}
                      className="min-h-11 rounded-xl border-2 border-border px-4 text-sm font-semibold"
                    >
                      Editar
                    </button>
                    <form
                      action={excluirRegistro}
                      onSubmit={(e) => {
                        if (!window.confirm("Excluir o registro dessa semana? Não dá pra desfazer.")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="min-h-11 rounded-xl border-2 border-accent px-4 text-sm font-semibold"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
