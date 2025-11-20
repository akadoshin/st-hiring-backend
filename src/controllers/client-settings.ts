import express, { Request, Response, Router } from 'express';

import { getDefaultClientSettings } from '../entity/client-settings';
import { validateClientId, validateClientSettings, ValidationError } from '../utils/validation';
import { ClientSettingsDAL } from '../dal/client-settings.dal';

export const createGetClientSettingsController =
  ({ clientSettingsDAL }: { clientSettingsDAL: ClientSettingsDAL }) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = validateClientId(req.params.clientId);

      let settings = await clientSettingsDAL.getSettingsByClientId(clientId);

      if (!settings) {
        const defaultSettings = getDefaultClientSettings(clientId);
        settings = await clientSettingsDAL.upsertSettings(clientId, defaultSettings);
      }

      res.json(settings);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Error getting client settings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const createPutClientSettingsController =
  ({ clientSettingsDAL }: { clientSettingsDAL: ClientSettingsDAL }) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = validateClientId(req.params.clientId);
      const validatedSettings = validateClientSettings(req.body, clientId);

      const updatedSettings = await clientSettingsDAL.upsertSettings(clientId, validatedSettings);

      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Error updating client settings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const createClientSettingsRouter = ({ clientSettingsDAL }: { clientSettingsDAL: ClientSettingsDAL }): Router => {
  const router = express.Router();

  router.get('/:clientId', createGetClientSettingsController({ clientSettingsDAL }));
  router.put('/:clientId', createPutClientSettingsController({ clientSettingsDAL }));

  return router;
};
