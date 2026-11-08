import { column, Schema, Table } from '@powersync/react-native';

/**
 * Espelho local (SQLite) das tabelas de supabase/migrations. O id é implícito no PowerSync.
 * Booleanos viram integer (0/1) e datas viram texto ISO no SQLite.
 */
const comTerreiro = { terreiro_id: column.text };

export const schema = new Schema({
  terreiros: new Table({ nome: column.text }),
  usuarios: new Table({
    ...comTerreiro,
    nome: column.text,
    email: column.text,
    papel: column.text,
  }),
  opcoes_lista: new Table({ ...comTerreiro, tipo: column.text, nome: column.text }),
  mediuns: new Table({
    ...comTerreiro,
    nome: column.text,
    telefone: column.text,
    email: column.text,
    obrigacao_id: column.text,
    missao_id: column.text,
  }),
  entidades: new Table({ ...comTerreiro, nome: column.text, medium_id: column.text }),
  consulentes: new Table({
    ...comTerreiro,
    nome: column.text,
    telefone: column.text,
    email: column.text,
  }),
  giras: new Table({
    ...comTerreiro,
    tipo: column.text,
    data_hora: column.text,
    status: column.text,
  }),
  presencas_mediuns: new Table({
    ...comTerreiro,
    gira_id: column.text,
    medium_id: column.text,
    presente: column.integer,
  }),
  presencas_consulentes: new Table({
    ...comTerreiro,
    gira_id: column.text,
    consulente_id: column.text,
    presente: column.integer,
  }),
  consultas: new Table({
    ...comTerreiro,
    gira_id: column.text,
    entidade_id: column.text,
    em_consulta: column.integer,
  }),
  entradas_fila: new Table({
    ...comTerreiro,
    consulta_id: column.text,
    consulente_id: column.text,
    posicao: column.integer,
    status: column.text,
    chegada_em: column.text,
  }),
  lotes: new Table({ ...comTerreiro, gira_id: column.text, inicio: column.text, fim: column.text }),
  atendimentos: new Table({
    ...comTerreiro,
    gira_id: column.text,
    consulente_id: column.text,
    entidade_id: column.text,
    entrada_fila_id: column.text,
    lote_id: column.text,
    inicio: column.text,
    fim: column.text,
  }),
});
