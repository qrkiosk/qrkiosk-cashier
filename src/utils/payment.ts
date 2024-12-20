import { PaymentStatus } from "@/types/payment";

export const toDisplayPaymentStatus = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.UNPAID:
      return "Chưa thanh toán";
    case PaymentStatus.PARTIALLY_PAID:
      return "Đã thanh toán một phần";
    case PaymentStatus.PAID:
      return "Đã thanh toán";
    default:
      return "";
  }
};
