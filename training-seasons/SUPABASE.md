# Configurando o Supabase (passo a passo)

Esta é a parte que só o dono do projeto pode fazer (criar a conta e o projeto).
Leva uns 20 minutos. Em qualquer passo que travar, me mande um print.

## 1. Criar o projeto

1. Entre em [supabase.com](https://supabase.com) e faça login (pode ser com o GitHub).
2. Clique em **New project**.
3. Preencha:
   - **Name:** `training-seasons`
   - **Database password:** crie uma senha forte e **guarde num gerenciador de senhas**. Não vai ser usada no site, mas é a "chave mestra" do banco.
   - **Region:** `South America (São Paulo)`, que fica mais perto de quem usa.
   - Plano: **Free**.
4. Espere uns 2 minutos até o projeto ficar pronto.

## 2. Pegar as duas chaves públicas

1. No menu lateral: **Project Settings** (engrenagem) → **API**.
2. Copie:
   - **Project URL** (algo como `https://abcdxyz.supabase.co`)
   - A chave **anon** / **publishable** (a pública).
3. **Não copie** a chave `service_role` / `secret`. Ela dá poder total sobre o banco e nunca entra no site.

Essas duas são seguras para ficar no site: quem protege os dados é o RLS (passo 4), e não o sigilo delas.

## 3. Colocar as chaves no projeto

**No seu computador** (se for rodar localmente): na pasta `training-seasons`, copie `.env.example` para `.env.local` e preencha as 3 linhas.

**Na Vercel:** Project → **Settings → Environment Variables**. Crie:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | o Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave anon/publishable |
| `NEXT_PUBLIC_SITE_URL` | o endereço do seu site na Vercel (ex: `https://training-seasons.vercel.app`) |

Depois vá em **Deployments → ⋯ → Redeploy**. Essas variáveis só valem a partir do próximo deploy.

## 4. Criar a tabela e as regras de privacidade

1. No Supabase: **SQL Editor → New query**.
2. Abra o arquivo `supabase/migrations/0001_perfis.sql` deste repositório, copie tudo e cole.
3. Clique em **Run**. Deve aparecer "Success".

Isso cria a ficha de cada pessoa e liga o RLS: cada um só consegue ler e editar a própria ficha.

## 5. Configurar o login

### 5.1 Endereços do site
**Authentication → URL Configuration**
- **Site URL:** o endereço do site na Vercel (o mesmo de `NEXT_PUBLIC_SITE_URL`).
- **Redirect URLs:** adicione `http://localhost:3000/**` e `https://SEU-SITE.vercel.app/**`.

### 5.2 Confirmação de e-mail
**Authentication → Sign In / Providers → Email**: deixe **Confirm email** ligado, com tamanho mínimo de senha 8.

### 5.3 Modelos dos e-mails (importante)
**Authentication → Email Templates**. Troque o link dos dois modelos abaixo, para o link funcionar mesmo se a pessoa abrir o e-mail em outro aparelho.

**Confirm signup** (corpo):
```html
<h2>Confirme seu cadastro</h2>
<p>Bem-vindo(a) ao Training Seasons! Clique para ativar sua conta:</p>
<p><a href="{{ .SiteURL }}/auth/confirmar?token_hash={{ .TokenHash }}&type=email">Confirmar meu e-mail</a></p>
```

**Reset password** (corpo):
```html
<h2>Criar nova senha</h2>
<p>Clique para escolher uma nova senha. Se não foi você, ignore este e-mail.</p>
<p><a href="{{ .SiteURL }}/auth/confirmar?token_hash={{ .TokenHash }}&type=recovery&proxima=/nova-senha">Criar nova senha</a></p>
```

## 6. Envio de e-mails para amigos e família (atenção)

O serviço de e-mail embutido do Supabase é só para testes: tem limite baixo de envios por hora e, pelo que sei, só entrega para e-mails da própria equipe do projeto (confirme em **Authentication → Emails**, onde aparece o aviso). Para convidar outras pessoas, configure um **SMTP próprio** em **Authentication → Emails → SMTP Settings**.

Opções com plano gratuito: Resend, Brevo ou o próprio Gmail com "senha de app". Me diga qual prefere e eu te guio.

## 7. Testar

1. Abra o site → **Criar conta** com um e-mail seu.
2. Abra o e-mail e clique em **Confirmar meu e-mail**: você deve cair no painel com "Olá, seu nome!".
3. Clique em **Sair**, depois em **Entrar**, e teste também **Esqueci minha senha**.
