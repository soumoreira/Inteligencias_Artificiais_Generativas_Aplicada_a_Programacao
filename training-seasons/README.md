# Training Seasons

App web (PWA) de controle e acompanhamento de peso. Definição completa do projeto em [`../PROJETO.md`](../PROJETO.md).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Próximas etapas: Supabase (login e banco) e Vercel (hospedagem).

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
npm test         # testes das regras de semana, números e meta
```

## Estrutura

- `src/app/globals.css`: paleta (tokens `--ts-*`) e temas claro/escuro
- `src/app/layout.tsx`: idioma pt-BR, viewport e cor do tema
- `src/app/manifest.ts`: manifest do PWA
- `public/icons/`: ícones provisórios do PWA

## Deploy (Vercel)

1. Importar o repositório na Vercel.
2. Em **Root Directory**, escolher `training-seasons`.
3. Framework: Next.js (detectado automaticamente). Sem variáveis de ambiente nesta etapa.
