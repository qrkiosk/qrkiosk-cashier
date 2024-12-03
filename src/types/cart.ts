import { PaymentType } from "./payment";
import { BaseProductVariant } from "./product";
import { ShippingType } from "./shipping";

export interface CartProductVariant extends BaseProductVariant {
  uniqIdentifier: string;
  quantity: number;
  note?: string;
}

export interface Cart {
  items: CartProductVariant[];
  payment?: { paymentType: PaymentType | null };
  shipping?: { shippingType: ShippingType };
}
