/**
 * Contrato entre App e Dados: o que a camada de Dados expõe para as telas.
 * Leituras são observáveis (o PowerSync reemite quando o SQLite local muda);
 * escritas são locais e sincronizam depois, exceto as marcadas "online".
 * Toda escrita valida com as funções do Domínio e falha com DomainError nomeado.
 */
import type { Acao } from './permissoes';
import type {
  Atendimento,
  Consulente,
  Consulta,
  EntradaFila,
  Entidade,
  Gira,
  Id,
  Lote,
  Medium,
  OpcaoLista,
  Papel,
  PresencaConsulente,
  PresencaMedium,
  TipoGira,
  TipoLista,
  Usuario,
} from './types';
import type { Movimento } from './fila';

export interface Observavel<T> {
  subscribe(ouvinte: (valor: T) => void): () => void;
}

/** Sessão e contas (5, 10, 20, 30). Operações "online" falham com SEM_CONEXAO quando offline. */
export interface ContaRepository {
  sessaoAtual(): Observavel<Usuario | null>;
  /** online */ existeAlgumaConta(): Promise<boolean>;
  /** online */ criarContaManager(email: string, senha: string): Promise<Usuario>;
  /** online na primeira vez no aparelho; depois a sessão vale offline */
  entrar(email: string, senha: string): Promise<Usuario>;
  sair(): Promise<void>;
  /** online */ pedirRedefinicaoDeSenha(email: string): Promise<void>;
  usuarios(): Observavel<Usuario[]>;
  /** online */ criarConta(dados: {
    email: string;
    senha: string;
    papel: Exclude<Papel, 'manager'>;
  }): Promise<Usuario>;
  /** online */ editarConta(
    id: Id,
    dados: { email?: string; papel?: Papel; senha?: string },
  ): Promise<Usuario>;
  pode(acao: Acao): boolean;
}

/** Listas de Obrigação e Missão (50). */
export interface ListaRepository {
  opcoes(tipo: TipoLista): Observavel<OpcaoLista[]>;
  /** Reaproveita a existente se o nome já existe. */
  adicionar(tipo: TipoLista, nome: string): Promise<OpcaoLista>;
  renomear(id: Id, nome: string): Promise<void>;
  /** Quantos médiuns usam a opção: a tela confirma antes de remover. */
  emUso(id: Id): Promise<number>;
  /** Médiuns que usavam ficam com o campo vazio. */
  remover(id: Id): Promise<void>;
}

/** Médiuns e entidades (60, 65). */
export interface MediumRepository {
  mediuns(): Observavel<Medium[]>;
  nomesParecidos(nome: string): Promise<string[]>;
  cadastrar(dados: Omit<Medium, 'id' | 'terreiroId'>): Promise<Medium>;
  entidades(): Observavel<Entidade[]>;
  cadastrarEntidade(dados: { nome: string; mediumId: Id }): Promise<Entidade>;
}

/** Consulentes (70). */
export interface ConsulenteRepository {
  buscar(nome: string): Observavel<Consulente[]>;
  cadastrar(dados: Omit<Consulente, 'id' | 'terreiroId'>): Promise<Consulente>;
}

/** Giras (80, 90, 170). */
export interface GiraRepository {
  giras(): Observavel<Gira[]>;
  giraAtiva(): Observavel<Gira | null>;
  criar(dados: { tipo: TipoGira; dataHora: string | null }): Promise<Gira>;
  ativar(id: Id): Promise<void>;
  /** Pendências para a confirmação de finalizar. */
  pendencias(id: Id): Promise<{ naFila: number; emAtendimento: number }>;
  /** Encerra o que estiver aberto (90). */
  finalizar(id: Id): Promise<void>;
  cancelar(id: Id): Promise<void>;
}

/** Presenças da gira ativa (100, 110). */
export interface PresencaRepository {
  presencasDeMediuns(giraId: Id): Observavel<PresencaMedium[]>;
  marcarMedium(giraId: Id, mediumId: Id, presente: boolean): Promise<void>;
  presencasDeConsulentes(giraId: Id): Observavel<PresencaConsulente[]>;
  marcarConsulente(giraId: Id, consulenteId: Id, presente: boolean): Promise<void>;
}

/** Consultas, filas e atendimentos da gira normal (120–150). */
export interface ConsultaRepository {
  consultas(giraId: Id): Observavel<Consulta[]>;
  entidadesDisponiveis(giraId: Id): Observavel<Entidade[]>;
  colocarEmConsulta(giraId: Id, entidadeId: Id): Promise<Consulta>;
  tirarDeConsulta(consultaId: Id): Promise<Consulta>;
  fila(consultaId: Id): Observavel<EntradaFila[]>;
  /** Também marca a presença do consulente na gira. */
  adicionarNaFila(consultaId: Id, consulenteId: Id): Promise<EntradaFila>;
  removerDaFila(entradaId: Id): Promise<void>;
  mover(entradaId: Id, movimento: Movimento): Promise<void>;
  /** Fila congelada: leva a entrada para a fila de outra consulta ativa. */
  redistribuir(entradaId: Id, paraConsultaId: Id): Promise<void>;
  iniciarAtendimento(entradaId: Id): Promise<Atendimento>;
  /** Encerra a consulta se a fila zerou. */
  finalizarAtendimento(entradaId: Id): Promise<void>;
  desfazerAtendimento(entradaId: Id): Promise<void>;
  atendimentos(giraId: Id): Observavel<Atendimento[]>;
}

/** Trabalho de fogo (160). */
export interface FogoRepository {
  loteAberto(giraId: Id): Observavel<Lote | null>;
  iniciarLote(giraId: Id, consulenteIds: Id[]): Promise<Lote>;
  finalizarLote(loteId: Id): Promise<void>;
  atenderIndividual(giraId: Id, consulenteId: Id): Promise<Atendimento>;
  /** Remove só o atendimento deste consulente, sem afetar o resto do lote. */
  desfazer(atendimentoId: Id): Promise<void>;
  atendimentos(giraId: Id): Observavel<Atendimento[]>;
}
