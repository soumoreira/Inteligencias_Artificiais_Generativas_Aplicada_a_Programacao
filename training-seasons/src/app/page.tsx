import Link from "next/link";

const etapas = [
  { titulo: "Registro semanal", texto: "Anote seu peso em poucos segundos." },
  { titulo: "Gráfico de evolução", texto: "Veja o caminho até a sua meta." },
  { titulo: "IMC e progresso", texto: "Entenda quanto já avançou e quanto falta." },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="w-full border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-strong text-on-fill text-lg font-bold"
          >
            T
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Training Seasons
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16">
        <section className="flex flex-col gap-5">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Temporada 1
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Cada temporada, um passo mais perto da sua meta.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Registre seu peso, acompanhe a evolução e comemore cada conquista, no
            celular ou no computador.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/entrar"
              className="flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-on-fill"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="flex min-h-12 items-center justify-center rounded-xl border-2 border-accent px-6 text-base font-semibold"
            >
              Criar conta
            </Link>
          </div>
        </section>

        <section aria-labelledby="o-que-vem" className="flex flex-col gap-4">
          <h2 id="o-que-vem" className="text-xl font-semibold">
            O que vem por aí
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {etapas.map((e) => (
              <li
                key={e.titulo}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold">{e.titulo}</h3>
                <p className="mt-1 text-muted">{e.texto}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto w-full max-w-5xl px-4 py-5 text-sm text-muted sm:px-6">
          Este app é informativo e não substitui a orientação de médico ou
          nutricionista.
        </p>
      </footer>
    </div>
  );
}
