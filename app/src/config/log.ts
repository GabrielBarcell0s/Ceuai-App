/**
 * Log do app. LGPD: nunca recebe nome, telefone, e-mail nem texto digitado. Só nome do
 * evento e, de erro, o código nomeado ou o tipo da exceção.
 */
function resumo(erro: unknown): string {
  if (erro && typeof erro === 'object' && 'code' in erro)
    return String((erro as { code: unknown }).code);
  return erro instanceof Error ? erro.name : typeof erro;
}

export const log = {
  evento(nome: string): void {
    if (__DEV__) console.info(`[ceuai] ${nome}`);
  },
  erro(nome: string, erro: unknown): void {
    console.warn(`[ceuai] ${nome}: ${resumo(erro)}`);
  },
};
