import { Cart, CartItemOption } from "@/types/cart";
import { PaymentType } from "@/types/payment";
import { ShippingType } from "@/types/shipping";
import { calcServiceFee, calcTotalDiscount } from "@/utils/order";
import { atom } from "jotai";
import isEmpty from "lodash/isEmpty";
import { currentOrderAtom, draftOrderAtom } from ".";
import { productVariantAtom } from "./product";

export const INITIAL_CART_STATE: Cart = {
  items: [],
  payment: { paymentType: null },
  shipping: { shippingType: ShippingType.ON_SITE },
};

export const cartAtom = atom<Cart>(INITIAL_CART_STATE);
export const isCartDirtyAtom = atom(false);
export const isCartEmptyAtom = atom((get) => isEmpty(get(cartAtom).items));

export const cartTotalQtyAtom = atom((get) => {
  return get(cartAtom).items.reduce((acc, item) => {
    if (!item.isActive) return acc;
    return acc + item.quantity;
  }, 0);
});

export const cartSubtotalAmountAtom = atom((get) => {
  return get(cartAtom).items.reduce((total, item) => {
    if (!item.isActive) return total;

    const quantity = item.quantity;
    const baseItemPrice = item.priceSale;
    const opts = item.options as unknown as CartItemOption[];

    const optionsPrice = opts.reduce((acc, opt) => {
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

export const cartTotalAmountAtom = atom((get) => {
  const order = get(currentOrderAtom);

  if (!order) return 0;

  const subtotal = get(cartSubtotalAmountAtom);
  const serviceFee = calcServiceFee(order, subtotal);
  const totalDiscount = calcTotalDiscount(order, subtotal);

  return Math.max(subtotal + serviceFee - totalDiscount, 0);
});

export const draftCartTotalAmountAtom = atom((get) => {
  const order = get(draftOrderAtom);
  const subtotal = get(cartSubtotalAmountAtom);
  const serviceFee = calcServiceFee(order, subtotal);
  const totalDiscount = calcTotalDiscount(order, subtotal);

  return Math.max(subtotal + serviceFee - totalDiscount, 0);
});

export const addCartItemAtom = atom(null, (get, set) => {
  const productVariant = get(productVariantAtom);
  if (!productVariant) return;

  const cart = get(cartAtom);
  set(cartAtom, {
    ...cart,
    items: cart.items.concat({
      ...productVariant,
      uniqIdentifier:
        productVariant.uniqIdentifier ?? `${productVariant.id}--${Date.now()}`,
    }),
  });
  set(isCartDirtyAtom, true);
});

export const updateCartItemAtom = atom(null, (get, set) => {
  const productVariant = get(productVariantAtom);
  if (!productVariant) return;

  const cart = get(cartAtom);
  set(cartAtom, {
    ...cart,
    items: cart.items.map((item) =>
      item.uniqIdentifier === productVariant.uniqIdentifier
        ? { ...productVariant }
        : item,
    ),
  });
  set(isCartDirtyAtom, true);
});

export const removeCartItemAtom = atom(
  null,
  (get, set, uniqIdentifier: string) => {
    const cart = get(cartAtom);

    set(cartAtom, {
      ...cart,
      items: cart.items.reduce((acc, item) => {
        if (item.uniqIdentifier !== uniqIdentifier) {
          return [...acc, item];
        }

        if (item.originalOrderDetailId != null) {
          return [
            ...acc,
            {
              ...item,
              isActive: false,
              isDone: false,
              serviceTaskId: item.serviceTaskId ?? null,
              originalOrderDetailId: item.originalOrderDetailId,
            },
          ];
        }

        return acc;
      }, []),
    });
    set(isCartDirtyAtom, true);
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

export const isPreservingCartAtom = atom(false);

export const pickerBagAtom = atom<Cart["items"]>([]);

export const pickerBagTotalQtyAtom = atom((get) => {
  return get(pickerBagAtom).reduce((acc, item) => {
    if (!item.isActive) return acc;
    return acc + item.quantity;
  }, 0);
});

export const pickerBagTotalAmountAtom = atom((get) => {
  return get(pickerBagAtom).reduce((total, item) => {
    if (!item.isActive) return total;

    const quantity = item.quantity;
    const baseItemPrice = item.priceSale;
    const opts = item.options as unknown as CartItemOption[];

    const optionsPrice = opts.reduce((acc, opt) => {
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

export const addToPickerBagAtom = atom(null, (get, set) => {
  const productVariant = get(productVariantAtom);
  if (!productVariant) return;

  set(
    pickerBagAtom,
    get(pickerBagAtom).concat({
      ...productVariant,
      uniqIdentifier:
        productVariant.uniqIdentifier ?? `${productVariant.id}--${Date.now()}`,
    }),
  );
});

export const clearPickerBagAtom = atom(null, (_get, set) => {
  set(pickerBagAtom, []);
});

export const mergePickerBagIntoCartAtom = atom(null, (get, set) => {
  const cart = get(cartAtom);

  set(cartAtom, {
    ...cart,
    items: cart.items.concat(get(pickerBagAtom)),
  });
  set(isCartDirtyAtom, true);
  set(pickerBagAtom, []);
});
