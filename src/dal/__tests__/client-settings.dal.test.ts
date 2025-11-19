import { Db, Collection } from 'mongodb';
import { createClientSettingsDAL, ClientSettingsDAL } from '../client-settings.dal';
import { ClientSettings, getDefaultClientSettings } from '../../entity/client-settings';

describe('ClientSettingsDAL', () => {
  let mockCollection: jest.Mocked<Collection<ClientSettings>>;
  let mockDb: jest.Mocked<Db>;
  let dal: ClientSettingsDAL;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    } as any;

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as any;

    dal = createClientSettingsDAL(mockDb);
  });

  describe('getSettingsByClientId', () => {
    it('should return settings when found', async () => {
      const clientId = 1;
      const expectedSettings = getDefaultClientSettings(clientId);
      mockCollection.findOne.mockResolvedValue(expectedSettings);

      const result = await dal.getSettingsByClientId(clientId);

      expect(result).toEqual(expectedSettings);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ clientId });
    });

    it('should return null when settings not found', async () => {
      const clientId = 999;
      mockCollection.findOne.mockResolvedValue(null);

      const result = await dal.getSettingsByClientId(clientId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ clientId });
    });
  });

  describe('upsertSettings', () => {
    it('should upsert settings and return them', async () => {
      const clientId = 1;
      const settings = getDefaultClientSettings(clientId);
      mockCollection.updateOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });

      const result = await dal.upsertSettings(clientId, settings);

      expect(result).toEqual(settings);
      expect(mockCollection.updateOne).toHaveBeenCalledWith({ clientId }, { $set: settings }, { upsert: true });
    });

    it('should create new document when it does not exist', async () => {
      const clientId = 2;
      const settings = getDefaultClientSettings(clientId);
      mockCollection.updateOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: { clientId } as any,
      });

      const result = await dal.upsertSettings(clientId, settings);

      expect(result).toEqual(settings);
      expect(mockCollection.updateOne).toHaveBeenCalledWith({ clientId }, { $set: settings }, { upsert: true });
    });
  });
});
