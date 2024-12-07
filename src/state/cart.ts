import { Cart, CartItemOption } from "@/types/cart";
import { Order } from "@/types/order";
import { PaymentType } from "@/types/payment";
import { ShippingType } from "@/types/shipping";
import { isValidDiscountOrFee } from "@/utils/order";
import { atom } from "jotai";
import { currentOrderAtom } from ".";
import { productVariantAtom } from "./product";

export const INITIAL_CART_STATE: Cart = {
  items: [],
  payment: { paymentType: null },
  shipping: { shippingType: ShippingType.ON_SITE },
};

export const cartAtom = atom<Cart>(INITIAL_CART_STATE);
export const isCartDirtyAtom = atom(false);

export const cartTotalQtyAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.items.reduce((acc, item) => acc + item.quantity, 0);
});

export const cartSubtotalAmountAtom = atom((get) => {
  const cart = get(cartAtom);

  return cart.items.reduce((total, item) => {
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

const calcDiscountVoucher = (order: Order | null) =>
  order?.discountVoucher ?? 0;

const calcDiscountAmount = (order: Order | null, initialAmount: number) => {
  const discountAmount = order?.discountAmount ?? 0;
  const discountPercentage = order?.discountPercentage ?? 0;

  if (isValidDiscountOrFee(discountPercentage)) {
    return initialAmount * discountPercentage;
  }

  return discountAmount;
};

const calcServiceFee = (order: Order | null, initialAmount: number) => {
  const serviceFee = order?.serviceFee ?? 0;
  const serviceFeePercentage = order?.serviceFeePercentage ?? 0;

  if (isValidDiscountOrFee(serviceFeePercentage)) {
    return initialAmount * serviceFeePercentage;
  }

  return serviceFee;
};

export const cartTotalAmountAtom = atom((get) => {
  const order = get(currentOrderAtom);
  const isCartDirty = get(isCartDirtyAtom);

  if (!isCartDirty) {
    return order?.totalAmount ?? 0;
  }

  const subtotal = get(cartSubtotalAmountAtom);
  const serviceFee = calcServiceFee(order, subtotal);
  const discountAmount = calcDiscountAmount(order, subtotal);
  const discountVoucher = calcDiscountVoucher(order);
  const totalDiscount = discountAmount + discountVoucher;

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
      items: cart.items.filter(
        (item) => item.uniqIdentifier !== uniqIdentifier,
      ),
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
