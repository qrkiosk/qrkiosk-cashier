import { OrderProductVariant } from "./order";
import { PaymentType } from "./payment";
import { BaseProductVariant } from "./product";
import { ShippingType } from "./shipping";

export interface CartItemOptionDetail {
  id: string;
  productVariantId: string;
  name: string;
  price: number;
}

export interface CartItemOption {
  id: string;
  name: string;
  details: any[];
  selectedDetail: CartItemOptionDetail | null;
  selectedDetails: CartItemOptionDetail[]; // can be empty array
}

export interface CartOrderItem {
  uniqIdentifier: string;
  quantity: number;
  note: string;
  id: string;
  name: string;
  price: number;
  priceSale: number;
  isActive: boolean;
  isDone: boolean;
  serviceTaskId: string | null;
  originalOrderDetailId: string | null;
  options: CartItemOption[];
  _refODVariants?: OrderProductVariant[];
}

export interface CartProductVariant extends BaseProductVariant {
  uniqIdentifier: string;
  quantity: number;
  isDone: boolean;
  serviceTaskId: string | null;
  originalOrderDetailId: string | null;
  note?: string;
  _refODVariants?: OrderProductVariant[];
}

export type CartItem = CartOrderItem | CartProductVariant;

export interface Cart {
  items: CartItem[];
  metadata: {
    isDirty: boolean;
    suggestedFirstItems: boolean;
  };
  payment?: { paymentType: PaymentType | null };
  shipping?: { shippingType: ShippingType };
}
