import type { Metadata } from "next";
import { Suspense } from "react";
import { CabecalhoPrivado } from "@/components/cabecalho-privado";
import { FormPerfil } from "@/components/form-perfil";
import { RegistroPeso, type Registro } from "@/components/registro-peso";
import { faltaParaMeta } from "@/lib/meta";
import { perfilCompleto, perfilParaFormulario } from "@/lib/perfil";
import { dataBr, formatarKg, hojeNoBrasil, rotuloDaSemana } from "@/lib/semana";
import { usuarioAtual } from "@/lib/supabase/usuario";

export const metadata: Metadata = { title: "Painel" };

export default function PainelPage() {
  return (
    <div className="flex flex-1 flex-col">
      <CabecalhoPrivado />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        {/* O crachá é lido a cada visita, então fica atrás de uma tela de carregamento */}
        <Suspense fallback={<p className="text-muted">Carregando…</p>}>
          <Conteudo />
        </Suspense>
      </main>
    </div>
  );
}

function Cartao({ titulo, valor, detalhe }: { titulo: string; valor: string; detalhe?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{titulo}</p>
      <p className="mt-1 text-2xl font-bold">{valor}</p>
      {detalhe && <p className="mt-1 text-sm text-muted">{detalhe}</p>}
    </div>
  );
}

async function Conteudo() {
  const { supabase, user } = await usuarioAtual();

  // Tudo abaixo passa pelo RLS: só vêm dados da própria pessoa.
  const [{ data: perfil }, { data: registros }] = await Promise.all([
    supabase
      .from("perfis")
      .select("nome, altura_cm, peso_inicial_kg, meta_peso_kg, meta_prazo")
      .maybeSingle(),
    supabase
      .from("registros_peso")
      .select("id, semana, peso_kg, observacao")
      .order("semana", { ascending: false })
      .limit(104),
  ]);

  const nome = perfil?.nome || (user.user_metadata?.nome as string | undefined) || "";

  // Primeiro acesso: em vez de redirecionar para outra página (o navegador guardaria esse
  // redirecionamento na memória e a pessoa ficaria "presa"), mostramos o formulário aqui mesmo.
  if (!perfil || !perfilCompleto(perfil)) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Vamos começar!</h1>
          <p className="text-muted">
            Conte um pouco sobre você e defina sua meta. Dá pra mudar depois.
          </p>
        </div>
        <FormPerfil
          hoje={hojeNoBrasil()}
          voltarAoPainel={false}
          inicial={perfilParaFormulario(perfil, nome)}
        />
      </div>
    );
  }

  const lista = (registros ?? []) as Registro[];
  const ultimo = lista[0];
  const inicial = Number(perfil.peso_inicial_kg);
  const meta = Number(perfil.meta_peso_kg);
  const atual = ultimo ? Number(ultimo.peso_kg) : inicial;
  const { atingida, falta } = faltaParaMeta(inicial, atual, meta);
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Olá{nome ? `, ${nome}` : ""}!</h1>
        <p className="text-muted">
          {atingida
            ? "Meta atingida! Que temporada. Hora de pensar na próxima?"
            : "Cada semana conta. Registre seu peso e acompanhe o caminho."}
        </p>
      </div>

      <section aria-label="Resumo" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Cartao titulo="Peso inicial" valor={formatarKg(inicial)} />
        <Cartao
          titulo="Peso atual"
          valor={formatarKg(atual)}
          detalhe={ultimo ? `Semana de ${rotuloDaSemana(ultimo.semana)}` : undefined}
        />
        <Cartao
          titulo="Meta"
          valor={formatarKg(meta)}
          detalhe={perfil.meta_prazo ? `Até ${dataBr(perfil.meta_prazo)}` : undefined}
        />
        <Cartao
          titulo={atingida ? "Situação" : "Falta para a meta"}
          valor={atingida ? "Atingida!" : formatarKg(falta)}
        />
      </section>

      <RegistroPeso registros={lista} hoje={hojeNoBrasil()} />
    </>
  );
}
