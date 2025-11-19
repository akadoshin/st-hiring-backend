import { Request, Response } from 'express';
import { createGetClientSettingsController, createPutClientSettingsController } from '../client-settings';
import { ClientSettingsDAL } from '../../dal/client-settings.dal';
import { getDefaultClientSettings, ClientSettings, DeliveryMethodEnum } from '../../entity/client-settings';

describe('ClientSettings Controllers', () => {
  let mockDAL: jest.Mocked<ClientSettingsDAL>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnThis();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };

    mockDAL = {
      getSettingsByClientId: jest.fn(),
      upsertSettings: jest.fn(),
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createGetClientSettingsController', () => {
    it('should return existing settings when found', async () => {
      const clientId = 1;
      const existingSettings = getDefaultClientSettings(clientId);
      mockRequest = {
        params: { clientId: '1' },
      };
      mockDAL.getSettingsByClientId.mockResolvedValue(existingSettings);

      const controller = createGetClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(mockDAL.getSettingsByClientId).toHaveBeenCalledWith(clientId);
      expect(jsonMock).toHaveBeenCalledWith(existingSettings);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should create and return default settings when not found', async () => {
      const clientId = 2;
      const defaultSettings = getDefaultClientSettings(clientId);
      mockRequest = {
        params: { clientId: '2' },
      };
      mockDAL.getSettingsByClientId.mockResolvedValue(null);
      mockDAL.upsertSettings.mockResolvedValue(defaultSettings);

      const controller = createGetClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(mockDAL.getSettingsByClientId).toHaveBeenCalledWith(clientId);
      expect(mockDAL.upsertSettings).toHaveBeenCalledWith(clientId, defaultSettings);
      expect(jsonMock).toHaveBeenCalledWith(defaultSettings);
    });

    it('should return 400 for invalid clientId', async () => {
      mockRequest = {
        params: { clientId: 'invalid' },
      };

      const controller = createGetClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid clientId. Must be a number.',
      });
      expect(mockDAL.getSettingsByClientId).not.toHaveBeenCalled();
    });

    it('should return 500 on DAL error', async () => {
      mockRequest = {
        params: { clientId: '1' },
      };
      mockDAL.getSettingsByClientId.mockRejectedValue(new Error('Database error'));

      const controller = createGetClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createPutClientSettingsController', () => {
    const validUpdateData: Partial<ClientSettings> = {
      deliveryMethods: [
        {
          name: 'Print Now',
          enum: DeliveryMethodEnum.PRINT_NOW,
          order: 1,
          isDefault: true,
          selected: false,
        },
      ],
      fulfillmentFormat: {
        rfid: true,
        print: true,
      },
      printer: {
        id: 'printer-123',
      },
      printingFormat: {
        formatA: false,
        formatB: true,
      },
      scanning: {
        scanManually: false,
        scanWhenComplete: true,
      },
      paymentMethods: {
        cash: false,
        creditCard: true,
        comp: true,
      },
      ticketDisplay: {
        leftInAllotment: false,
        soldOut: false,
      },
      customerInfo: {
        active: true,
        basicInfo: true,
        addressInfo: true,
      },
    };

    it('should update and return settings for valid data', async () => {
      const clientId = 1;
      const updatedSettings = { ...getDefaultClientSettings(clientId), ...validUpdateData };
      mockRequest = {
        params: { clientId: '1' },
        body: validUpdateData, // No clientId in body
      };
      mockDAL.upsertSettings.mockResolvedValue(updatedSettings);

      const controller = createPutClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(mockDAL.upsertSettings).toHaveBeenCalledWith(clientId, expect.any(Object));
      expect(jsonMock).toHaveBeenCalledWith(updatedSettings);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid clientId', async () => {
      mockRequest = {
        params: { clientId: 'invalid' },
        body: validUpdateData,
      };

      const controller = createPutClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid clientId. Must be a number.',
      });
      expect(mockDAL.upsertSettings).not.toHaveBeenCalled();
    });

    it('should return 400 for validation errors', async () => {
      mockRequest = {
        params: { clientId: '1' },
        body: {
          deliveryMethods: [{ name: 123 }], // Invalid: name should be string
        },
      };

      const controller = createPutClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      );
      expect(mockDAL.upsertSettings).not.toHaveBeenCalled();
    });

    it('should return 500 on DAL error', async () => {
      const clientId = 1;
      const { clientId: _, ...settingsWithoutClientId } = getDefaultClientSettings(clientId);
      mockRequest = {
        params: { clientId: '1' },
        body: settingsWithoutClientId,
      };
      mockDAL.upsertSettings.mockRejectedValue(new Error('Database error'));

      const controller = createPutClientSettingsController({ clientSettingsDAL: mockDAL });
      await controller(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
