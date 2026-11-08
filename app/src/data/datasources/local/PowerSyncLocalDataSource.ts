import '@azure/core-asynciterator-polyfill';
import { PowerSyncDatabase, Schema } from '@powersync/react-native';

import type { LocalDataSource } from './LocalDataSource';

// Schema vazio até a start-3 modelar as tabelas.
export const schema = new Schema({});

export class PowerSyncLocalDataSource implements LocalDataSource {
  readonly db = new PowerSyncDatabase({ schema, database: { dbFilename: 'ceuai.sqlite' } });

  async open(): Promise<void> {
    await this.db.init();
  }
}
