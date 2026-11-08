import { falha } from './errors';
import type { Papel } from './types';

/**
 * Ações protegidas por papel. Origem: histórias 10–180 e o seletor de papel do protótipo.
 * Manager tem acesso completo (briefing).
 */
export type Acao =
  | 'gerenciar_usuarios' // 10
  | 'gerenciar_listas' // 50
  | 'cadastrar_medium' // 60
  | 'cadastrar_entidade' // 65
  | 'cadastrar_consulente' // 70
  | 'gerenciar_giras' // 80, 90, 170: criar, ativar, finalizar, cancelar
  | 'marcar_presenca_medium' // 100
  | 'marcar_presenca_consulente' // 110
  | 'operar_consultas' // 120, 130, 140, 150: consultas, fila e atendimento
  | 'operar_fogo' // 160
  | 'ver_painel'; // 180

const PERMISSOES: Record<Papel, ReadonlySet<Acao>> = {
  manager: new Set<Acao>([
    'gerenciar_usuarios',
    'gerenciar_listas',
    'cadastrar_medium',
    'cadastrar_entidade',
    'cadastrar_consulente',
    'gerenciar_giras',
    'marcar_presenca_medium',
    'marcar_presenca_consulente',
    'operar_consultas',
    'operar_fogo',
    'ver_painel',
  ]),
  controlador: new Set<Acao>([
    'cadastrar_consulente',
    'marcar_presenca_consulente',
    'operar_consultas',
    'operar_fogo',
    'ver_painel',
  ]),
  contador: new Set<Acao>(['marcar_presenca_medium', 'marcar_presenca_consulente', 'ver_painel']),
};

export function pode(papel: Papel, acao: Acao): boolean {
  return PERMISSOES[papel].has(acao);
}

export function exigirPermissao(papel: Papel, acao: Acao): void {
  if (!pode(papel, acao)) falha('SEM_PERMISSAO', `${papel} não pode ${acao}`);
}
