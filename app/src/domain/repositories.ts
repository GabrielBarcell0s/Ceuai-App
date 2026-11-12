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
import type { PendenciaConsulta } from './consulta';
import type { Movimento } from './fila';

export interface Observavel<T> {
  subscribe(ouvinte: (valor: T) => void): () => void;
}

/** Sessão e contas (5, 10, 20, 30). Operações "online" falham com SEM_CONEXAO quando offline. */
export interface ContaRepository {
  sessaoAtual(): Observavel<Usuario | null>;
  /** online */ existeAlgumaConta(): Promise<boolean>;
  /** online */ criarContaManager(dados: {
    nome: string;
    email: string;
    senha: string;
  }): Promise<Usuario>;
  /** online na primeira vez no aparelho; depois a sessão vale offline */
  entrar(email: string, senha: string): Promise<Usuario>;
  sair(): Promise<void>;
  /** online */ pedirRedefinicaoDeSenha(email: string): Promise<void>;
  usuarios(): Observavel<Usuario[]>;
  /** online */ criarConta(dados: {
    nome: string;
    email: string;
    senha: string;
    papel: Exclude<Papel, 'manager'>;
  }): Promise<Usuario>;
  /** online */ editarConta(
    id: Id,
    dados: { nome?: string; email?: string; papel?: Papel; senha?: string },
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
  /** O que a confirmação de finalizar ou cancelar mostra (90, 170). */
  pendencias(id: Id): Promise<PendenciaConsulta[]>;
  /** Encerra o que estiver aberto (90). */
  finalizar(id: Id): Promise<void>;
  /** Cancelando gira ativa, encerra o que estiver aberto, como finalizar (170). */
  cancelar(id: Id): Promise<void>;
}

/** Presenças da gira ativa (100, 110). */
export interface PresencaRepository {
  presencasDeMediuns(giraId: Id): Observavel<PresencaMedium[]>;
  /** O que a confirmação mostra antes de marcar ausente um médium com entidade em consulta (100). */
  pendenciasDoMedium(giraId: Id, mediumId: Id): Promise<PendenciaConsulta[]>;
  /** Ausente finaliza as consultas das entidades dele, como "Finalizar consulta" (100, 120). */
  marcarMedium(giraId: Id, mediumId: Id, presente: boolean): Promise<void>;
  presencasDeConsulentes(giraId: Id): Observavel<PresencaConsulente[]>;
  /** Presentes sem fila, prontos para entrar em uma (120, 130). */
  naoAtribuidos(giraId: Id): Observavel<Consulente[]>;
  marcarConsulente(giraId: Id, consulenteId: Id, presente: boolean): Promise<void>;
}

/** Consultas, filas e atendimentos da gira normal (120–150). */
export interface ConsultaRepository {
  consultas(giraId: Id): Observavel<Consulta[]>;
  entidadesDisponiveis(giraId: Id): Observavel<Entidade[]>;
  /** Liga de novo o registro se a entidade já esteve em consulta nesta gira. */
  colocarEmConsulta(giraId: Id, entidadeId: Id): Promise<Consulta>;
  /** O que a confirmação de "Finalizar consulta" mostra. */
  pendencias(consultaId: Id): Promise<PendenciaConsulta>;
  /** Finaliza o atendimento em andamento e devolve a fila para não atribuídos (120). */
  finalizarConsulta(consultaId: Id): Promise<void>;
  fila(consultaId: Id): Observavel<EntradaFila[]>;
  /** Também marca a presença do consulente na gira. */
  adicionarNaFila(consultaId: Id, consulenteId: Id): Promise<EntradaFila>;
  removerDaFila(entradaId: Id): Promise<void>;
  mover(entradaId: Id, movimento: Movimento): Promise<void>;
  iniciarAtendimento(entradaId: Id): Promise<Atendimento>;
  /** Fila zerada não tira a entidade de consulta (140). */
  finalizarAtendimento(entradaId: Id): Promise<void>;
  desfazerAtendimento(entradaId: Id): Promise<void>;
  atendimentos(giraId: Id): Observavel<Atendimento[]>;
}

/**
 * Estado da sincronização, mostrado em toda tela ("Sem conexão. Registrando no aparelho").
 * Origem: requisito transversal do briefing (tudo funciona sem internet) e protótipo.
 */
export interface SincronizacaoRepository {
  conectado(): Observavel<boolean>;
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

/** Todos os repositórios que a camada de Dados entrega para o App. */
export interface Repositorios {
  contas: ContaRepository;
  listas: ListaRepository;
  mediuns: MediumRepository;
  consulentes: ConsulenteRepository;
  giras: GiraRepository;
  presencas: PresencaRepository;
  consultas: ConsultaRepository;
  fogo: FogoRepository;
  sincronizacao: SincronizacaoRepository;
}
