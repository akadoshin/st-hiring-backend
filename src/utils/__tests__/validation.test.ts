import { validateClientSettings, validateClientId, ValidationError } from '../validation';
import { ClientSettings, DeliveryMethodEnum } from '../../entity/client-settings';

describe('Validation', () => {
  const validSettings: ClientSettings = {
    clientId: 1,
    deliveryMethods: [
      {
        name: 'Print Now',
        enum: DeliveryMethodEnum.PRINT_NOW,
        order: 1,
        isDefault: true,
        selected: true,
      },
    ],
    fulfillmentFormat: {
      rfid: false,
      print: false,
    },
    printer: {
      id: null,
    },
    printingFormat: {
      formatA: true,
      formatB: false,
    },
    scanning: {
      scanManually: true,
      scanWhenComplete: false,
    },
    paymentMethods: {
      cash: true,
      creditCard: false,
      comp: false,
    },
    ticketDisplay: {
      leftInAllotment: true,
      soldOut: true,
    },
    customerInfo: {
      active: false,
      basicInfo: false,
      addressInfo: false,
    },
  };

  describe('validateClientSettings', () => {
    const { clientId, ...validSettingsWithoutClientId } = validSettings;

    it('should validate correct settings', () => {
      const result = validateClientSettings(validSettingsWithoutClientId, validSettings.clientId);
      expect(result).toEqual(validSettings);
    });

    it('should throw ValidationError if settings is not an object', () => {
      expect(() => validateClientSettings(null, 1)).toThrow(ValidationError);
      expect(() => validateClientSettings(undefined, 1)).toThrow(ValidationError);
      expect(() => validateClientSettings([], 1)).toThrow(ValidationError);
      expect(() => validateClientSettings('string', 1)).toThrow(ValidationError);
      expect(() => validateClientSettings(123, 1)).toThrow(ValidationError);
    });

    it('should throw ValidationError if deliveryMethods is not an array', () => {
      expect(() =>
        validateClientSettings({ ...validSettingsWithoutClientId, deliveryMethods: {} }, validSettings.clientId),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if deliveryMethod has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            deliveryMethods: [{ ...validSettings.deliveryMethods[0], name: 123 }],
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);

      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            deliveryMethods: [{ ...validSettings.deliveryMethods[0], order: '1' }],
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);

      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            deliveryMethods: [{ ...validSettings.deliveryMethods[0], isDefault: 'true' }],
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if deliveryMethod.enum is not a valid enum value', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            deliveryMethods: [{ ...validSettings.deliveryMethods[0], enum: 'INVALID_ENUM' }],
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);

      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            deliveryMethods: [{ ...validSettings.deliveryMethods[0], enum: 'print_now' }],
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if fulfillmentFormat has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            fulfillmentFormat: { rfid: 'false', print: false },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);

      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            fulfillmentFormat: { rfid: false, print: 'false' },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if printer.id is not string or null', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            printer: { id: 123 },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);

      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            printer: { id: true },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should validate printer.id as string', () => {
      const result = validateClientSettings(
        {
          ...validSettingsWithoutClientId,
          printer: { id: 'printer-123' },
        },
        validSettings.clientId,
      );
      expect(result.printer.id).toBe('printer-123');
    });

    it('should validate printer.id as null', () => {
      const result = validateClientSettings(
        {
          ...validSettingsWithoutClientId,
          printer: { id: null },
        },
        validSettings.clientId,
      );
      expect(result.printer.id).toBeNull();
    });

    it('should throw ValidationError if printingFormat has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            printingFormat: { formatA: 'true', formatB: false },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if scanning has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            scanning: { scanManually: 'true', scanWhenComplete: false },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if paymentMethods has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            paymentMethods: { cash: 'true', creditCard: false, comp: false },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if ticketDisplay has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            ticketDisplay: { leftInAllotment: 'true', soldOut: true },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if customerInfo has invalid types', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            customerInfo: { active: 'false', basicInfo: false, addressInfo: false },
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError if nested objects are arrays', () => {
      expect(() =>
        validateClientSettings(
          {
            ...validSettingsWithoutClientId,
            fulfillmentFormat: [],
          },
          validSettings.clientId,
        ),
      ).toThrow(ValidationError);
    });
  });

  describe('validateClientId', () => {
    it('should validate and return number for valid numeric string', () => {
      const result = validateClientId('123');
      expect(result).toBe(123);
      expect(typeof result).toBe('number');
    });

    it('should validate and return number for valid number', () => {
      const result = validateClientId(456);
      expect(result).toBe(456);
      expect(typeof result).toBe('number');
    });

    it('should throw ValidationError for invalid string', () => {
      expect(() => validateClientId('abc')).toThrow(ValidationError);
      expect(() => validateClientId('')).toThrow(ValidationError);
    });

    it('should throw ValidationError for null', () => {
      expect(() => validateClientId(null)).toThrow(ValidationError);
    });

    it('should throw ValidationError for undefined', () => {
      expect(() => validateClientId(undefined)).toThrow(ValidationError);
    });

    it('should throw ValidationError for NaN', () => {
      expect(() => validateClientId(NaN)).toThrow(ValidationError);
    });

    it('should throw ValidationError for Infinity', () => {
      expect(() => validateClientId(Infinity)).toThrow(ValidationError);
      expect(() => validateClientId(-Infinity)).toThrow(ValidationError);
    });
  });
});
