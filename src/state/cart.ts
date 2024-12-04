import { Cart, CartItemOption, CartItemOptionDetail } from "@/types/cart";
import { Order, OrderDetail } from "@/types/order";
import { PaymentType } from "@/types/payment";
import { ShippingType } from "@/types/shipping";
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import uniqBy from "lodash/uniqBy";
import { currentOrderAtom } from ".";

const INITIAL_CART_STATE: Cart = {
  items: [],
  payment: { paymentType: null },
  shipping: { shippingType: ShippingType.ON_SITE },
};

export const cartAtom = atom<Cart>(INITIAL_CART_STATE);

export const cartTotalQtyAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.items.reduce((acc, item) => acc + item.quantity, 0);
});

export const cartSubtotalAtom = atom((get) => {
  const cart = get(cartAtom);

  return cart.items.reduce((total, item) => {
    const quantity = item.quantity;
    const baseItemPrice = item.price;
    const optionsPrice = item.options.reduce((acc, opt) => {
      const selectedDetailPrice = opt.selectedDetail?.price ?? 0;
      const selectedDetailsTotalAmount = opt.selectedDetails.reduce(
        (a, d) => a + d.price,
        0,
      );

      return acc + selectedDetailPrice + selectedDetailsTotalAmount;
    }, 0);
    const itemPrice = (baseItemPrice + optionsPrice) * quantity;

    return total + itemPrice;
  }, 0);
});

// export const addToCartAtom = atom(null, (get, set) => {
//   const productVariant = get(productVariantAtom);
//   if (productVariant == null) return;

//   const cart = get(cartAtom);
//   const isEditingCartItem = get(isEditingCartItemAtom);

//   if (isEditingCartItem) {
//     set(cartAtom, {
//       ...cart,
//       items: cart.items.map((item) =>
//         item.uniqIdentifier === productVariant.uniqIdentifier
//           ? { ...productVariant }
//           : item,
//       ),
//     });
//   } else {
//     set(cartAtom, {
//       ...cart,
//       items: cart.items.concat({
//         ...productVariant,
//         uniqIdentifier:
//           productVariant.uniqIdentifier ??
//           `${productVariant.id}--${Date.now()}`,
//       }),
//     });
//   }
// });

export const removeCartItemAtom = atom(
  null,
  (get, set, uniqIdentifier: string) => {
    const cart = get(cartAtom);

    set(cartAtom, {
      ...cart,
      items: cart.items.filter(
        (item) => item.uniqIdentifier !== uniqIdentifier,
      ),
    });
  },
);

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartAtom, INITIAL_CART_STATE);
});

export const setPaymentTypeAtom = atom(
  null,
  (get, set, paymentType: string | PaymentType) => {
    const cart = get(cartAtom);
    set(cartAtom, {
      ...cart,
      payment: {
        ...cart.payment,
        paymentType: paymentType as PaymentType,
      },
    });
  },
);

export const setShippingTypeAtom = atom(
  null,
  (get, set, shippingType: string | ShippingType) => {
    const cart = get(cartAtom);
    set(cartAtom, {
      ...cart,
      shipping: {
        ...cart.shipping,
        shippingType: shippingType as ShippingType,
      },
    });
  },
);

export const convertOrderVarsToItemOptions = (
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
        selectedDetail: isMultiChoiceOpt ? null : selectedDetails[0],
        selectedDetails: isMultiChoiceOpt ? selectedDetails : [],
      };
    },
  );

  return opts;
};

export const convertOrderToCart = (order: Order): Cart => ({
  items: order.details.map((od) => ({
    uniqIdentifier: `${od.id}--${Date.now()}`,
    id: od.productId,
    name: od.productName,
    price: od.price,
    quantity: od.quantity,
    note: od.note,
    options: convertOrderVarsToItemOptions(od.variants),
  })),
  payment: { paymentType: order.paymentType },
});

export const syncCartFromOrderEffect = atomEffect((get, set) => {
  const order = get(currentOrderAtom);

  if (!order) return;

  set(cartAtom, convertOrderToCart(order));
});
