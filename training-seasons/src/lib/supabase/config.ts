// Lê as duas variáveis públicas do Supabase.
// Se alguma estiver faltando, o site continua abrindo e mostra um aviso amigável
// em vez de quebrar (útil enquanto o projeto Supabase ainda não foi criado).
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}
