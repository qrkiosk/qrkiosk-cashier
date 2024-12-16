import { Product, SelectedOptions } from "@/types.global";
import {
  Cart,
  CartItemOption,
  CartItemOptionDetail,
  CartOrderItem,
} from "@/types/cart";
import { Order, OrderDetail } from "@/types/order";
import { CartProductVariant } from "@/types/product";
import uniqBy from "lodash/uniqBy";

export function getDefaultOptions(product: Product): SelectedOptions {
  return {
    size: product.sizes?.[0],
    color: product.colors?.[0].name,
  };
}

export function isIdentical(
  option1: SelectedOptions,
  option2: SelectedOptions,
) {
  return option1.size === option2.size && option1.color === option2.color;
}

export const calcItemTotalAmount = (
  item: CartOrderItem | CartProductVariant,
) => {
  const quantity = item.quantity;
  const baseItemPrice = item.price;
  const opts = item.options as unknown as CartItemOption[];

  const optionsPrice = opts.reduce((acc, opt) => {
    const selectedDetailPrice = opt.selectedDetail?.price ?? 0;
    const selectedDetailsTotalPrice = opt.selectedDetails.reduce(
      (a, d) => a + d.price,
      0,
    );
    return acc + selectedDetailPrice + selectedDetailsTotalPrice;
  }, 0);

  return (baseItemPrice + optionsPrice) * quantity;
};

export const genMultiChoiceOptionDisplayText = (option: CartItemOption) =>
  option.selectedDetails.map((d) => d.name).join(", ");

export const convertOrderVariantsToOptions = (
  variants: OrderDetail["variants"],
) => {
  const opts = uniqBy(variants, "productOptionId").map<CartItemOption>(
    (variant) => {
      const { productOptionId: poId, poName } = variant;
      const selectedDetails = variants.reduce<CartItemOptionDetail[]>(
        (acc, v) => {
          if (v.productOptionId === poId) {
            return [
              ...acc,
              {
                id: v.productOptionDetailId,
                name: v.podName,
                price: v.podPrice,
                productVariantId: v.productVariantId,
              },
            ];
          }

          return acc;
        },
        [],
      );
      const isMultiChoiceOpt = selectedDetails.length > 1;

      return {
        id: poId,
        name: poName,
        details: [],
        selectedDetail: isMultiChoiceOpt ? null : selectedDetails[0],
        selectedDetails: isMultiChoiceOpt ? selectedDetails : [],
      };
    },
  );

  return opts;
};

export const convertOrderToCart = (
  order: Order,
): Pick<Cart, "items" | "payment"> => ({
  items: order.details.map((od) => ({
    uniqIdentifier: `${od.productId}--${Date.now()}`,
    id: od.productId,
    name: od.productName,
    price: od.productPrice,
    priceSale: od.price,
    quantity: od.quantity,
    note: od.note,
    isActive: od.isActive,
    isDone: od.isDone ?? false,
    serviceTaskId: od.serviceTaskId ?? null,
    originalOrderDetailId: od.id,
    options: convertOrderVariantsToOptions(od.variants),
  })),
  payment: { paymentType: order.paymentType ?? null },
});
