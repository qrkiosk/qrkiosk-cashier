import { CreateUpdateTrace } from "./common";
import { PaymentStatus, PaymentType } from "./payment";
import { ShippingType } from "./shipping";
import { UserRole } from "./user";

export enum OrderStatus {
  NEW,
  WAIT,
  PROCESS,
  DONE,
}

export interface OrderProductVariant {
  id: string;
  productVariantId: string;
  productOptionId: string;
  poName: string;
  productOptionDetailId: string;
  podName: string;
  podPrice: number;
}

export interface OrderDetail {
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
  isDone: boolean;
  serviceTaskId: string;
  note: string;
  variants: OrderProductVariant[];
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
  createdByRole: UserRole;
  details: OrderDetail[];
}

export interface OrderDetailForOrderReqBody {
  id: string | null;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  price: number;
  amount: number;
  totalAmount: number;
  note: string;
  isActive: boolean;
  isDone: boolean;
  serviceTaskId: string | null;
  variants: Array<{
    id: string | null;
    isActive: boolean;
    productVariantId: string;
    productOptionId: string;
    poName: string;
    productOptionDetailId: string;
    podName: string;
    podPrice: number;
  }>;
}

export interface OrderReqBody {
  id: string | null; // for create order case
  companyId: number;
  storeId: number;
  customer: { id: string; name: string } | null;
  paymentType: PaymentType | null;
  sourceType: ShippingType;
  tableId: number;
  tableName: string;
  note: string;
  discountAmount: number;
  discountPercentage: number;
  discountVoucher?: number;
  serviceFee: number;
  serviceFeePercentage: number;
  status: OrderStatus;
  statusNew: OrderStatus;
  isActive: boolean;
  details: OrderDetailForOrderReqBody[];
}
