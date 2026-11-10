import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// O "porteiro": roda antes das páginas abrirem.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Ignora arquivos estáticos (imagens, ícones, manifest) para não gastar processamento à toa.
  matcher: [
    "/((?!_next/static|_next/image|manifest.webmanifest|icon.png|apple-icon.png|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
