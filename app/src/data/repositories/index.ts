import type { Repositorios } from '@/domain';

/**
 * Raiz de composição: monta os repositórios sobre a fonte Local (PowerSync) e a Remota
 * (Supabase). Cada card acrescenta aqui o repositório que implementa; até lá a entrada
 * fica ausente e a tela que precisa dela falha com mensagem clara (useRepositorio).
 */
export function criarRepositorios(): Partial<Repositorios> {
  return {};
}
