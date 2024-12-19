import { Product, SelectedOptions } from "@/types.global";
import {
  Cart,
  CartItem,
  CartItemOption,
  CartItemOptionDetail,
} from "@/types/cart";
import { Order, OrderDetail } from "@/types/order";
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

export const calcItemTotalAmount = (item: CartItem) => {
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
    (opt) => {
      const selectedDetails = variants.reduce<CartItemOptionDetail[]>(
        (acc, v) => {
          if (v.productOptionId === opt.productOptionId) {
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

      return {
        id: opt.productOptionId,
        name: opt.poName,
        details: [],
        selectedDetail: null, // can't determine if this opt is singlechoice or multichoice at this stage
        selectedDetails, // so every selected detail will be inside this array
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
    _refODVariants: od.variants,
  })),
  payment: { paymentType: order.paymentType ?? null },
});
