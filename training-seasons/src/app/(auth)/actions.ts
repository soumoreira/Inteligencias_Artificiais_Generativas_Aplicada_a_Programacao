"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, getSupabaseConfig } from "@/lib/supabase/config";

// "valores" devolve de volta o que a pessoa digitou (nunca a senha) quando há erro,
// porque o React limpa o formulário depois de cada envio.
export type Estado = {
  erro?: string;
  sucesso?: string;
  valores?: { nome?: string; email?: string };
};

const SEM_CONFIG: Estado = {
  erro: "O login ainda não foi configurado neste ambiente.",
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MINIMA = 8;

function texto(formData: FormData, campo: string) {
  const v = formData.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

// Traduz os códigos de erro do Supabase para mensagens claras em português.
function traduzirErro(codigo: string | undefined): string {
  switch (codigo) {
    case "invalid_credentials":
      return "E-mail ou senha incorretos.";
    case "email_not_confirmed":
      return "Confirme seu e-mail antes de entrar. Procure a mensagem que enviamos (veja também o spam).";
    case "weak_password":
      return "Essa senha é fraca. Use pelo menos 8 caracteres, misturando letras e números.";
    case "same_password":
      return "A nova senha precisa ser diferente da atual.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.";
    case "signup_disabled":
      return "Novos cadastros estão temporariamente desativados.";
    default:
      return "Algo deu errado. Tente novamente em instantes.";
  }
}

export async function entrar(_: Estado, formData: FormData): Promise<Estado> {
  if (!getSupabaseConfig()) return SEM_CONFIG;

  const email = texto(formData, "email").toLowerCase();
  const senha = formData.get("senha");
  if (!EMAIL_VALIDO.test(email) || typeof senha !== "string" || !senha) {
    return { erro: "Informe seu e-mail e sua senha.", valores: { email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) return { erro: traduzirErro(error.code), valores: { email } };

  redirect("/painel");
}

export async function cadastrar(
  _: Estado,
  formData: FormData,
): Promise<Estado> {
  if (!getSupabaseConfig()) return SEM_CONFIG;

  const nome = texto(formData, "nome");
  const email = texto(formData, "email").toLowerCase();
  const senha = formData.get("senha");
  const confirmar = formData.get("confirmar");
  const maiorDe18 = formData.get("maior18") === "on";
  const valores = { nome, email };

  if (nome.length < 2 || nome.length > 60) {
    return { erro: "Informe seu nome (entre 2 e 60 caracteres).", valores };
  }
  if (!EMAIL_VALIDO.test(email)) {
    return { erro: "Informe um e-mail válido.", valores };
  }
  if (typeof senha !== "string" || senha.length < SENHA_MINIMA) {
    return {
      erro: `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`,
      valores,
    };
  }
  if (senha !== confirmar) {
    return { erro: "As senhas não são iguais.", valores };
  }
  if (!maiorDe18) {
    return {
      erro: "O Training Seasons é para maiores de 18 anos. Marque a confirmação para continuar.",
      valores,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirmar`,
      data: { nome, maior_de_18: true },
    },
  });
  if (error) return { erro: traduzirErro(error.code), valores };

  // Mesma resposta exista ou não uma conta com esse e-mail (evita revelar quem tem conta).
  return {
    sucesso:
      "Quase lá! Enviamos um e-mail de confirmação. Abra a mensagem e clique no link para ativar sua conta.",
  };
}

export async function recuperarSenha(
  _: Estado,
  formData: FormData,
): Promise<Estado> {
  if (!getSupabaseConfig()) return SEM_CONFIG;

  const email = texto(formData, "email").toLowerCase();
  if (!EMAIL_VALIDO.test(email)) {
    return { erro: "Informe um e-mail válido.", valores: { email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/confirmar?proxima=/nova-senha`,
  });
  if (error && error.code?.startsWith("over_")) {
    return { erro: traduzirErro(error.code), valores: { email } };
  }

  return {
    sucesso:
      "Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha.",
  };
}

export async function definirNovaSenha(
  _: Estado,
  formData: FormData,
): Promise<Estado> {
  if (!getSupabaseConfig()) return SEM_CONFIG;

  const senha = formData.get("senha");
  const confirmar = formData.get("confirmar");
  if (typeof senha !== "string" || senha.length < SENHA_MINIMA) {
    return { erro: `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.` };
  }
  if (senha !== confirmar) {
    return { erro: "As senhas não são iguais." };
  }

  const supabase = await createClient();
  // Confere no servidor do Supabase que existe um crachá válido (veio do link do e-mail).
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return {
      erro: "O link expirou ou já foi usado. Peça um novo em “Esqueci minha senha”.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) return { erro: traduzirErro(error.code) };

  redirect("/painel");
}

export async function sair() {
  if (getSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
