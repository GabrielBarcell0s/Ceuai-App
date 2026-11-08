import { falha } from './errors';
import type { OpcaoLista, TipoGira, TipoLista } from './types';

/** Nome obrigatório e sem espaços sobrando (50, 60, 65, 70). */
export function nomeValido(nome: string): string {
  const limpo = nome.trim().replace(/\s+/g, ' ');
  if (!limpo) falha('NOME_OBRIGATORIO');
  return limpo;
}

/** Campo opcional: string vazia vira null (60, 70). */
export function opcional(valor: string | null | undefined): string | null {
  const limpo = valor?.trim();
  return limpo ? limpo : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** E-mail de conta de usuário (5, 10). */
export function emailValido(email: string): string {
  const limpo = email.trim().toLowerCase();
  if (!EMAIL.test(limpo)) falha('EMAIL_INVALIDO');
  return limpo;
}

/** Não cadastra duas contas com o mesmo e-mail (10). */
export function exigirEmailLivre(email: string, existentes: readonly string[]): void {
  const alvo = email.trim().toLowerCase();
  if (existentes.some((e) => e.trim().toLowerCase() === alvo)) falha('EMAIL_JA_CADASTRADO');
}

/** Primeiro acesso só existe enquanto não há nenhuma conta (5). */
export function exigirPrimeiroAcesso(totalDeContas: number): void {
  if (totalDeContas > 0) falha('CONTA_MANAGER_JA_EXISTE');
}

/** Gira nasce agendada com tipo obrigatório (80). */
export function tipoGiraValido(tipo: string | null | undefined): TipoGira {
  if (tipo !== 'normal' && tipo !== 'fogo') falha('TIPO_GIRA_OBRIGATORIO');
  return tipo;
}

/** Normaliza para comparar nomes: minúsculas, sem acento e sem espaços extras. */
export function chaveDeNome(nome: string): string {
  return nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Opção duplicada não é criada: a existente é reaproveitada (50). */
export function opcaoExistente(
  opcoes: readonly OpcaoLista[],
  tipo: TipoLista,
  nome: string,
): OpcaoLista | undefined {
  const alvo = chaveDeNome(nome);
  return opcoes.find((o) => o.tipo === tipo && chaveDeNome(o.nome) === alvo);
}

/**
 * Aviso de nome parecido no cadastro de médium, sem bloquear (60).
 * Parecido: um nome contém o outro, ou diferem em até 2 letras.
 */
export function nomesParecidos(nome: string, existentes: readonly string[]): string[] {
  const alvo = chaveDeNome(nome).replace(/ /g, '');
  if (alvo.length < 4) return [];
  return existentes.filter((e) => {
    const outro = chaveDeNome(e).replace(/ /g, '');
    return outro.includes(alvo) || alvo.includes(outro) || distancia(alvo, outro) <= 2;
  });
}

function distancia(a: string, b: string): number {
  const linha = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = linha[j];
      linha[j] = Math.min(
        linha[j] + 1,
        linha[j - 1] + 1,
        anterior + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      anterior = guardado;
    }
  }
  return linha[b.length];
}
