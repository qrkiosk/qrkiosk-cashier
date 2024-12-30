import { PaymentStatus, PaymentType } from "@/types/payment";

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

export const toDisplayPaymentMethod = (method: PaymentType) => {
  switch (method) {
    case PaymentType.BANK:
      return "Chuyển khoản";
    case PaymentType.E_WALLET:
      return "Ví điện tử";
    case PaymentType.COD:
      return "Tiền mặt";
    case PaymentType.MOMO:
      return "Ví Momo";
    default:
      return "";
  }
};
