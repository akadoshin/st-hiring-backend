import { z } from 'zod';
import { ClientSettings, DeliveryMethodEnum } from '../entity/client-settings';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const DeliveryMethodSchema = z.object({
  name: z.string(),
  enum: z.nativeEnum(DeliveryMethodEnum),
  order: z.number(),
  isDefault: z.boolean(),
  selected: z.boolean(),
});

const clientIdSchema = z
  .union([z.string(), z.number()])
  .refine((val) => val !== null && val !== undefined && val !== '', {
    message: 'Invalid clientId. Must be a number.',
  })
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val) && isFinite(val), {
    message: 'Invalid clientId. Must be a number.',
  });

const ClientSettingsBodySchema = z.object({
  deliveryMethods: z.array(DeliveryMethodSchema),
  fulfillmentFormat: z.object({
    rfid: z.boolean(),
    print: z.boolean(),
  }),
  printer: z.object({
    id: z.union([z.string(), z.null()]),
  }),
  printingFormat: z.object({
    formatA: z.boolean(),
    formatB: z.boolean(),
  }),
  scanning: z.object({
    scanManually: z.boolean(),
    scanWhenComplete: z.boolean(),
  }),
  paymentMethods: z.object({
    cash: z.boolean(),
    creditCard: z.boolean(),
    comp: z.boolean(),
  }),
  ticketDisplay: z.object({
    leftInAllotment: z.boolean(),
    soldOut: z.boolean(),
  }),
  customerInfo: z.object({
    active: z.boolean(),
    basicInfo: z.boolean(),
    addressInfo: z.boolean(),
  }),
});

export const validateClientId = (value: unknown): number => {
  try {
    return clientIdSchema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid clientId. Must be a number.');
    }
    throw error;
  }
};

export const validateClientSettings = (value: unknown, clientId: number): ClientSettings => {
  try {
    const bodySettings = ClientSettingsBodySchema.parse(value);
    return { ...bodySettings, clientId } as ClientSettings;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || 'Validation failed';
      throw new ValidationError(message);
    }
    throw error;
  }
};
