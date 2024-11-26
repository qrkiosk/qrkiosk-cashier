import { OrderStatus } from "../types/order";

export const toDisplayOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.NEW:
      return "Mới";
    case OrderStatus.PROCESS:
      return "Đang xử lý";
    case OrderStatus.DONE:
      return "Hoàn thành";
    default:
      return "";
  }
};
