import { PaymentStatus } from "../types/payment";

export const toDisplayPaymentStatus = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.UNPAID:
      return "Chưa thanh toán";
    case PaymentStatus.PAID:
      return "Đã thanh toán";
    default:
      return "";
  }
};
