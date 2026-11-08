import '@azure/core-asynciterator-polyfill';
import { PowerSyncDatabase } from '@powersync/react-native';

import type { LocalDataSource } from './LocalDataSource';
import { schema } from './schema';

export class PowerSyncLocalDataSource implements LocalDataSource {
  readonly db = new PowerSyncDatabase({ schema, database: { dbFilename: 'ceuai.sqlite' } });

  async open(): Promise<void> {
    await this.db.init();
  }
}
