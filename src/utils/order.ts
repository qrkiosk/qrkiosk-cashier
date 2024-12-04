import { Order, OrderReqBody, OrderStatus } from "../types/order";

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

export const isValidDiscountOrFee = (value: number | null | undefined) =>
  value != null && Number.isFinite(value) && value > 0;

export const genOrderReqBody = (
  order: Order,
  updatedFields: Partial<OrderReqBody>,
): OrderReqBody => ({
  id: order.id,
  companyId: order.companyId,
  storeId: order.storeId,
  tableId: order.tableId,
  tableName: order.tableName,
  customer: {
    id: order.customerId,
    name: order.customerName,
  },
  paymentType: order.paymentType,
  sourceType: order.sourceType,
  note: order.note,
  discountAmount: order.discountAmount,
  discountPercentage: order.discountPercentage,
  serviceFee: order.serviceFee,
  serviceFeePercentage: order.serviceFeePercentage,
  status: order.status,
  details: order.details,
  ...updatedFields,
});
