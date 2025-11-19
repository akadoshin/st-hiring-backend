import type { Db, Collection } from 'mongodb';
import { ClientSettings } from '../entity/client-settings';

const COLLECTION_NAME = 'client_settings';

export interface ClientSettingsDAL {
  getSettingsByClientId(clientId: number): Promise<ClientSettings | null>;
  upsertSettings(clientId: number, settings: ClientSettings): Promise<ClientSettings>;
}

export const createClientSettingsDAL = (db: Db): ClientSettingsDAL => {
  const collection: Collection<ClientSettings> = db.collection<ClientSettings>(COLLECTION_NAME);

  return {
    async getSettingsByClientId(clientId: number): Promise<ClientSettings | null> {
      const settings = await collection.findOne({ clientId });
      return settings;
    },

    async upsertSettings(clientId: number, settings: ClientSettings): Promise<ClientSettings> {
      await collection.updateOne({ clientId }, { $set: settings }, { upsert: true });
      return settings;
    },
  };
};
