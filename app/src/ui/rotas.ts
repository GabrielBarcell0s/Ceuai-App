import type { Acao, Papel } from '@/domain';

/**
 * Mapa tela → histórias do protótipo, com a ação que libera cada área.
 * A navegação e os atalhos derivam daqui e de permissoes.ts; nenhuma tela testa papel na mão.
 */
export interface Rota {
  href: string;
  titulo: string;
  /** Texto curto do atalho na tela inicial. */
  atalho?: string;
  /** null: qualquer papel com sessão. */
  acao: Acao | null;
  historias: number[];
}

export const ROTAS = {
  inicio: { href: '/', titulo: 'Início', acao: null, historias: [40] },
  giraAtiva: {
    href: '/gira-ativa',
    titulo: 'Gira ativa',
    acao: 'ver_painel',
    historias: [90, 180],
  },
  giras: {
    href: '/giras',
    titulo: 'Giras',
    atalho: 'Agendar, ativar, finalizar',
    acao: 'gerenciar_giras',
    historias: [80, 90, 170],
  },
  consulentes: {
    href: '/consulentes',
    titulo: 'Consulentes',
    atalho: 'Buscar e cadastrar',
    acao: 'cadastrar_consulente',
    historias: [70],
  },
  mediuns: {
    href: '/mediuns',
    titulo: 'Médiuns',
    atalho: 'As pessoas da corrente',
    acao: 'cadastrar_medium',
    historias: [60],
  },
  entidades: {
    href: '/entidades',
    titulo: 'Entidades',
    atalho: 'Quem cada médium incorpora',
    acao: 'cadastrar_entidade',
    historias: [65],
  },
  usuarios: {
    href: '/usuarios',
    titulo: 'Usuários',
    atalho: 'Contas e papéis',
    acao: 'gerenciar_usuarios',
    historias: [10],
  },
  configuracoes: {
    href: '/configuracoes',
    titulo: 'Configurações',
    atalho: 'Listas, termos',
    acao: 'gerenciar_listas',
    historias: [50],
  },
  presencaMediuns: {
    href: '/presenca-mediuns',
    titulo: 'Presença de médiuns',
    acao: 'marcar_presenca_medium',
    historias: [100],
  },
  presencaConsulentes: {
    href: '/presenca-consulentes',
    titulo: 'Presença de consulentes',
    acao: 'marcar_presenca_consulente',
    historias: [110],
  },
  consultas: {
    href: '/consultas',
    titulo: 'Consultas',
    acao: 'operar_consultas',
    historias: [120],
  },
  fila: { href: '/fila', titulo: 'Fila', acao: 'operar_consultas', historias: [130, 140, 150] },
  fogo: { href: '/fogo', titulo: 'Trabalho de fogo', acao: 'operar_fogo', historias: [160] },
} as const satisfies Record<string, Rota>;

export type ChaveRota = keyof typeof ROTAS;

/** Atalhos da tela inicial, na ordem do protótipo. */
export const ATALHOS_INICIO: readonly ChaveRota[] = [
  'giras',
  'consulentes',
  'mediuns',
  'entidades',
  'usuarios',
  'configuracoes',
];

export const NOME_PAPEL: Record<Papel, string> = {
  manager: 'Manager',
  controlador: 'Controlador de fila',
  contador: 'Contador de presença',
};

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? '';
}
