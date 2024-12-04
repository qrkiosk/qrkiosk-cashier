import { PaymentType } from "./payment";
import { ShippingType } from "./shipping";

export interface CartItemOptionDetail {
  id: string;
  name: string;
  price: number;
}

export interface CartItemOption {
  id: string;
  name: string;
  selectedDetail: CartItemOptionDetail | null;
  selectedDetails: CartItemOptionDetail[]; // can be empty array
}

export interface CartItem {
  uniqIdentifier: string;
  quantity: number;
  note: string;
  id: string;
  name: string;
  price: number;
  options: CartItemOption[];
}

export interface Cart {
  items: CartItem[];
  payment?: { paymentType: PaymentType | null };
  shipping?: { shippingType: ShippingType };
}
