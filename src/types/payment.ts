export enum PaymentType {
  COD = "COD",
  BANK = "BANK",
  MOMO_SANDBOX = "MOMO_SANDBOX",
  MOMO = "MOMO",
}

export enum PaymentStatus {
  UNPAID,
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
