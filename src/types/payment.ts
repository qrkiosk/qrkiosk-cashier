export enum PaymentType {
  COD = "COD",
  BANK = "BANK",
  MOMO_SANDBOX = "MOMO_SANDBOX",
  MOMO = "MOMO",
  E_WALLET = " E_WALLET",
}

export enum PaymentStatus {
  UNPAID,
  PARTIALLY_PAID,
  PAID,
}

export interface PaymentReqBody {
  data: {
    amount: number;
    method: PaymentType;
  };
  info: {
    companyId: number;
    storeId: number;
    orderId: string;
    orderCode: string;
  };
}
