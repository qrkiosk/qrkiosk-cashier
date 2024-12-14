import { PaymentType } from "./payment";
import { CartProductVariant } from "./product";
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
}

export interface Cart {
  items: Array<CartOrderItem | CartProductVariant>;
  payment?: { paymentType: PaymentType | null };
  shipping?: { shippingType: ShippingType };
}
