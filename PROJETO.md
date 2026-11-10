# Projeto: Controle de Peso (Web + PWA)

> Documento de definição do projeto (premissas e escopo).
> Status: **v0.1 – rascunho aprovado nas entrevistas** | Data: 2026-11-10
> Itens marcados com **[A CONFIRMAR]** são suposições minhas, ainda não validadas.

---

## 1. Visão geral

Aplicação web para **acompanhar o peso ao longo do tempo** em direção a uma meta,
usável no computador e no celular, com qualquer tamanho de tela.

**Problema que resolve:** registrar o peso em qualquer lugar e enxergar a evolução
(gráfico, IMC, quanto falta pra meta) sem planilha.

**Sucesso = ** conseguir registrar o peso em menos de 10 segundos pelo celular
e ver a evolução num gráfico claro, em qualquer aparelho.

---

## 2. Público e uso

- Uso **pessoal + família e amigos** (poucos usuários).
- **Privacidade total entre usuários:** cada pessoa vê somente os próprios dados.
- Sem perfil de administrador/profissional na v1 **[A CONFIRMAR]**: o dono do projeto
  só gerencia o sistema, não vê dados dos outros.

---

## 3. Plataforma e acesso

- **Site responsivo** (mobile-first): funciona em celular, tablet e desktop.
- **PWA (instalável):** pode ser "instalado" na tela inicial, com ícone e abertura
  em tela cheia.
- **Conta com login + sincronização:** registra no celular, vê no PC (dados num
  banco online).
- **Cadastro livre com e-mail e senha.**
  - Risco: qualquer pessoa com o link cria conta e consome o plano gratuito.
  - Mitigações previstas: confirmação de e-mail obrigatória, limite de cadastros
    por IP/hora e possibilidade de desativar novos cadastros. **[A CONFIRMAR]**
- Recuperação de senha por e-mail.

---

## 4. Funcionalidades da v1 (MVP)

| # | Funcionalidade | Detalhe |
|---|----------------|---------|
| 1 | Cadastro/login | E-mail + senha, confirmação de e-mail, recuperar senha |
| 2 | Perfil | Nome, altura (cm), peso inicial, **meta de peso** (e prazo opcional) |
| 3 | Registro de peso | **Semanal**: data + peso (kg) + observação opcional; editar/excluir |
| 4 | Gráfico de evolução | Linha do peso ao longo do tempo, com a meta marcada |
| 5 | Cálculo de IMC | Usa altura + peso; mostra valor e faixa |
| 6 | Progresso da meta | Quanto já perdeu/ganhou e quanto falta |
| 7 | Lembrete semanal | Notificação para pesar (PWA; no iPhone exige instalar na tela inicial) |
| 8 | Exportar dados | Baixar histórico em CSV |
| 9 | Tema claro/escuro | Alternância manual + seguir o sistema |
| 10 | Motivação (visual) | Cores vibrantes, mensagens de incentivo, conquistas/selos simples (ex: "primeiro kg", "meta atingida") |

### Fora do escopo da v1
- Medidas corporais (cintura, quadril etc.)
- Fotos de progresso
- Compartilhar progresso / ranking entre usuários
- Integração com balanças ou apps de saúde
- Registro de alimentação/calorias
- App nativo nas lojas
- Multilíngue / libras e polegadas

---

## 5. Regras de negócio

- Peso em **kg** (1 casa decimal), altura em **cm**.
- **1 registro por semana** (semana começando na segunda-feira **[A CONFIRMAR]**).
  Se registrar de novo na mesma semana, o sistema atualiza o valor existente
  (avisando antes de sobrescrever).
- IMC = peso / (altura em metros)². Faixas padrão da OMS para adultos.
  O app é informativo e **não substitui orientação médica ou de nutricionista**
  (aviso visível no app).
- Usuários **maiores de 18 anos** na v1 **[A CONFIRMAR]** (IMC de adulto não
  serve para crianças/adolescentes).
- Meta pode ser de perda ou de ganho de peso (direção definida por peso inicial vs. meta).
- Mensagens motivacionais evitam tom de culpa; nada de linguagem que incentive
  extremos.

---

## 6. Idioma e formatos

- Interface 100% **Português (Brasil)**.
- Datas `dd/mm/aaaa`, números com vírgula decimal (ex: 72,5 kg).

---

## 7. Design e experiência

- Estilo **colorido e motivador** (cores vibrantes, selos de conquista),
  mantendo legibilidade e contraste adequado (acessibilidade AA).
- **Mobile-first:** botões grandes, uso com uma mão, formulário de registro
  em 1 tela.
- Gráfico legível em tela pequena (sem rolagem horizontal da página).
- Tema escuro disponível.

---

## 8. Privacidade e segurança

- Peso é **dado pessoal sensível de saúde** (LGPD).
- Cada usuário acessa apenas os próprios dados (regras de acesso no banco, não só na tela).
- Senhas nunca guardadas em texto puro (delegadas ao serviço de autenticação).
- Tráfego somente via HTTPS.
- Usuário pode **exportar** (CSV) e **excluir a conta e todos os dados**.
- Página simples de Política de Privacidade **[A CONFIRMAR]**.

---

## 9. Custo e hospedagem

- **Orçamento: gratuito** (planos free de hospedagem + banco).
- Premissa: poucos usuários, tráfego baixo. Se passar dos limites dos planos
  gratuitos, reavaliar.

---

## 10. Proposta técnica (a aprovar)

Sugestão pensada para quem está começando, tudo com plano gratuito e muita documentação:

| Peça | Sugestão | Analogia / por quê |
|------|----------|--------------------|
| Front-end (telas) | **Next.js (React) + TypeScript** | O "painel do carro": o que o usuário vê e toca |
| Estilo | **Tailwind CSS** | Facilita responsividade (celular/PC) |
| Gráficos | **Recharts** (ou Chart.js) | Biblioteca pronta de gráficos |
| Login + banco | **Supabase** (Auth + PostgreSQL) | O "cofre": guarda contas e dados, já traz login e regras de acesso |
| Hospedagem | **Vercel** | Onde o site fica no ar, deploy automático a cada commit |
| PWA | Manifest + Service Worker (ex: `@serwist/next`) | Torna o site instalável e permite notificações |

Alternativas simples (se preferir menos peças): Vite + React + Supabase.
**[A CONFIRMAR]** aprovação da stack.

---

## 11. Plano em etapas (sugestão)

1. **Fundação:** projeto criado, deploy no ar, tela inicial responsiva.
2. **Login:** cadastro, entrada, recuperar senha, regras de acesso no banco.
3. **Núcleo:** perfil, meta, registro semanal, lista do histórico.
4. **Visualização:** gráfico, IMC, progresso da meta.
5. **PWA:** instalável + lembrete semanal.
6. **Extras:** exportar CSV, tema escuro, conquistas/selos.
7. **Polimento:** acessibilidade, testes em vários aparelhos, política de privacidade.

---

## 12. Critérios de aceite (resumo)

- Funciona sem quebrar de layout de 320 px (celular pequeno) até telas grandes.
- Dá pra instalar na tela inicial do Android e iPhone.
- Dados registrados no celular aparecem no computador.
- Um usuário nunca consegue ver dados de outro (testado).
- Gráfico, IMC e progresso da meta batem com os dados registrados.

---

## 13. Pontos em aberto

- [ ] Aprovar a stack da seção 10.
- [ ] Confirmar semana começando na segunda e "só maiores de 18".
- [ ] Definir como lidar com cadastro livre no plano gratuito (limites/verificação).
- [ ] Nome do projeto e identidade visual (paleta de cores, logo).
- [ ] Quais conquistas/selos entram na v1.
- [ ] Dia/horário padrão do lembrete semanal.
