import { CreateUpdateTrace } from "./common";
import { PaymentStatus, PaymentType } from "./payment";

export enum ShippingType {
  ON_SITE = "ON_SITE",
}

export enum OrderStatus {
  NEW,
  WAIT,
  PROCESS,
  DONE,
}

export interface Order extends CreateUpdateTrace {
  id: string;
  companyId: number;
  storeId: number;
  totalPages: 0;
  page: 0;
  pageSize: 0;
  code: string;
  orderAt: null;
  shiftId: null;
  shiftCode: null;
  shiftEmployeeId: null;
  tableId: number;
  tableName: string;
  customerId: string;
  customerName: string;
  paymentType: PaymentType | null;
  sourceType: ShippingType;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  discountPercentage: number;
  discountVoucher: number;
  deliveryFee: number;
  serviceFee: number;
  serviceFeePercentage: number;
  totalAmount: number;
  totalQuantity: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  isActive: boolean;
  note: string;
  details: Array<{
    id: string;
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    price: number;
    amount: number;
    tax: number;
    taxAmount: number;
    discountAmount: number;
    discountPercentage: number;
    discountVoucher: number;
    totalAmount: number;
    isActive: boolean;
    note: string;
    variants: Array<{
      id: string;
      productVariantId: string;
      productOptionId: string;
      poName: string;
      productOptionDetailId: string;
      podName: string;
      podPrice: number;
    }>;
  }>;
}

export interface OrderReqBody {
  id: string;
  companyId: number;
  storeId: number;
  customer: {
    id: string;
    name: string;
  };
  paymentType: PaymentType | null;
  sourceType: ShippingType;
  tableId: number;
  tableName: string;
  note: string;
  discountAmount: number;
  discountPercentage: number;
  serviceFee: number;
  serviceFeePercentage: number;
  details: OrderDetail[];
}

export interface OrderDetail {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  price: number;
  amount: number;
  totalAmount: number;
  note: string;
  variants: OrderProductVariant[];
}

export interface OrderProductVariant {
  productVariantId: string;
  productOptionId: string;
  poName: string;
  productOptionDetailId: string;
  podName: string;
  podPrice: number;
}
