/**
 * Modelo canônico do CEUAI. Cada tipo aponta a história de origem.
 * Datas são ISO 8601 (string). Ids são UUID gerados no aparelho.
 * Todo registro carrega terreiroId (Restrições do briefing, preparação para v2).
 */
export type Id = string;
export type Iso = string;

/** Papéis do briefing ("3 papéis"). */
export type Papel = 'manager' | 'controlador' | 'contador';

/** Briefing: toda tabela com terreiro_id. Um terreiro só no MVP. */
export interface Terreiro {
  id: Id;
  nome: string;
}

/** Conta de acesso (5, 10). A senha vive só no Supabase Auth, nunca aqui. */
export interface Usuario {
  id: Id;
  terreiroId: Id;
  /** Obrigatório; é como o app cumprimenta ("Axé, Rosana") (5, 10). */
  nome: string;
  email: string;
  papel: Papel;
}

/** Listas configuráveis de Obrigação e Missão (50). */
export type TipoLista = 'obrigacao' | 'missao';
export interface OpcaoLista {
  id: Id;
  terreiroId: Id;
  tipo: TipoLista;
  nome: string;
}

/** Médium é a pessoa (60). Sem status ativo/afastado (briefing). */
export interface Medium {
  id: Id;
  terreiroId: Id;
  nome: string;
  telefone: string | null;
  email: string | null;
  /** Fica vazio quando a opção em uso é removida (50). */
  obrigacaoId: Id | null;
  missaoId: Id | null;
}

/** Entidade incorporada por um médium; um médium pode ter várias (65). */
export interface Entidade {
  id: Id;
  terreiroId: Id;
  nome: string;
  mediumId: Id;
}

/** Consulente (70). Só o nome é obrigatório. */
export interface Consulente {
  id: Id;
  terreiroId: Id;
  nome: string;
  telefone: string | null;
  email: string | null;
}

/** Gira (80, 90, 170). Trabalho de fogo é um tipo, não uma tela (briefing). */
export type TipoGira = 'normal' | 'fogo';
export type StatusGira = 'agendada' | 'ativa' | 'finalizada' | 'cancelada';
export interface Gira {
  id: Id;
  terreiroId: Id;
  tipo: TipoGira;
  /** Opcional: sem data, é gira "a agendar" (80). */
  dataHora: Iso | null;
  status: StatusGira;
}

/** Presença de médium por gira, alternável (100). */
export interface PresencaMedium {
  id: Id;
  terreiroId: Id;
  giraId: Id;
  mediumId: Id;
  presente: boolean;
}

/** Presença de consulente por gira, independente de fila (110); entrar em fila marca presente (130). */
export interface PresencaConsulente {
  id: Id;
  terreiroId: Id;
  giraId: Id;
  consulenteId: Id;
  presente: boolean;
}

/**
 * Entidade numa gira normal, dona de uma fila própria (120). Um registro por entidade por gira.
 * emConsulta liga ao colocar em consulta e desliga em "Finalizar consulta" ou com o médium
 * marcado ausente (100, 120); pode ligar de novo na mesma gira. Fila zerada não desliga (140).
 */
export interface Consulta {
  id: Id;
  terreiroId: Id;
  giraId: Id;
  entidadeId: Id;
  emConsulta: boolean;
}

/**
 * Lugar de um consulente na fila de uma consulta (130, 140, 150).
 * posicao é espaçada (1000, 2000...) e interna: a tela mostra 1, 2, 3.
 * devolvido: a consulta foi finalizada e o consulente voltou a não atribuído (120).
 * encerrado: a gira foi finalizada ou cancelada com ele aguardando (90, 170).
 */
export type StatusEntrada =
  'aguardando' | 'em_atendimento' | 'atendido' | 'removido' | 'devolvido' | 'encerrado';
export interface EntradaFila {
  id: Id;
  terreiroId: Id;
  consultaId: Id;
  consulenteId: Id;
  posicao: number;
  status: StatusEntrada;
  chegadaEm: Iso;
}

/**
 * Atendimento: consulente, entidade que atendeu, início e fim (briefing, 140).
 * Na fila: entradaFilaId preenchido. No fogo: entidadeId nulo, loteId no lote (160).
 */
export interface Atendimento {
  id: Id;
  terreiroId: Id;
  giraId: Id;
  consulenteId: Id;
  entidadeId: Id | null;
  entradaFilaId: Id | null;
  loteId: Id | null;
  inicio: Iso;
  fim: Iso | null;
}

/** Lote do trabalho de fogo: mesma duração real para todos (160). */
export interface Lote {
  id: Id;
  terreiroId: Id;
  giraId: Id;
  inicio: Iso;
  fim: Iso | null;
}
