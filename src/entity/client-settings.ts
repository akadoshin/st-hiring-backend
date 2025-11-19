export enum DeliveryMethodEnum {
  PRINT_NOW = 'PRINT_NOW',
  PRINT_AT_HOME = 'PRINT_AT_HOME',
}

export interface DeliveryMethod {
  name: string;
  enum: DeliveryMethodEnum;
  order: number;
  isDefault: boolean;
  selected: boolean;
}

export interface FulfillmentFormat {
  rfid: boolean;
  print: boolean;
}

export interface Printer {
  id: string | null;
}

export interface PrintingFormat {
  formatA: boolean;
  formatB: boolean;
}

export interface Scanning {
  scanManually: boolean;
  scanWhenComplete: boolean;
}

export interface PaymentMethods {
  cash: boolean;
  creditCard: boolean;
  comp: boolean;
}

export interface TicketDisplay {
  leftInAllotment: boolean;
  soldOut: boolean;
}

export interface CustomerInfo {
  active: boolean;
  basicInfo: boolean;
  addressInfo: boolean;
}

export interface ClientSettings {
  clientId: number;
  deliveryMethods: DeliveryMethod[];
  fulfillmentFormat: FulfillmentFormat;
  printer: Printer;
  printingFormat: PrintingFormat;
  scanning: Scanning;
  paymentMethods: PaymentMethods;
  ticketDisplay: TicketDisplay;
  customerInfo: CustomerInfo;
}

export const getDefaultClientSettings = (clientId: number): ClientSettings => {
  return {
    clientId,
    deliveryMethods: [
      {
        name: 'Print Now',
        enum: DeliveryMethodEnum.PRINT_NOW,
        order: 1,
        isDefault: true,
        selected: true,
      },
      {
        name: 'Print@Home',
        enum: DeliveryMethodEnum.PRINT_AT_HOME,
        order: 2,
        isDefault: false,
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
};
