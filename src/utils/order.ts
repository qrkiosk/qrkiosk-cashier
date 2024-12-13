import { Cart, CartItemOption } from "@/types/cart";
import {
  Order,
  OrderDetailForOrderReqBody,
  OrderReqBody,
  OrderStatus,
} from "@/types/order";
import isEmpty from "lodash/isEmpty";
import { calcItemTotalAmount } from "./cart";

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
  details: [],
  isActive: order.isActive,
  ...updatedFields,
});

export const buildOrderDetails = (cart: Cart): OrderDetailForOrderReqBody[] => {
  return cart.items.map((item) => {
    const { priceSale: productPrice, quantity } = item; // base price (before discount)
    const discountedPrice = productPrice - 0; // final price (discounted, without including extra options) - equals productPrice for now
    const amount = calcItemTotalAmount({ ...item, priceSale: discountedPrice });
    const totalAmount = amount;

    const variants = (item.options as CartItemOption[]).reduce((acc, opt) => {
      if (!isEmpty(opt.selectedDetail)) {
        const variantOfOption = {
          productVariantId: opt.selectedDetail.productVariantId,
          productOptionId: opt.id,
          poName: opt.name,
          productOptionDetailId: opt.selectedDetail.id,
          podName: opt.selectedDetail.name,
          podPrice: opt.selectedDetail.price,
        };

        return [...acc, variantOfOption];
      }

      if (!isEmpty(opt.selectedDetails)) {
        const variantsOfOption = opt.selectedDetails.map((dtl) => ({
          productVariantId: dtl.productVariantId,
          productOptionId: opt.id,
          poName: opt.name,
          productOptionDetailId: dtl.id,
          podName: dtl.name,
          podPrice: dtl.price,
        }));

        return [...acc, ...variantsOfOption];
      }

      return acc;
    }, []);

    return {
      productId: item.id,
      productName: item.name,
      productPrice,
      quantity,
      price: discountedPrice,
      amount,
      totalAmount,
      note: item.note ?? "",
      variants,
    };
  });
};
