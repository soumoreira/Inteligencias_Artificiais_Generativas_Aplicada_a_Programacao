import Link from "next/link";
import { sair } from "@/app/(auth)/actions";

// Cabeçalho das páginas que exigem login.
export function CabecalhoPrivado() {
  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/painel" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-strong text-on-fill text-lg font-bold"
          >
            T
          </span>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            Training Seasons
          </span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1 text-sm font-semibold">
          <Link href="/painel" className="flex min-h-11 items-center rounded-xl px-3">
            Painel
          </Link>
          <Link href="/perfil" className="flex min-h-11 items-center rounded-xl px-3">
            Perfil
          </Link>
          <form action={sair}>
            <button
              type="submit"
              className="min-h-11 rounded-xl border-2 border-border px-4 text-sm font-semibold"
            >
              Sair
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
