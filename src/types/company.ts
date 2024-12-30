import { CreateUpdateTrace } from "./common";
import { Order } from "./order";
import { PaymentType } from "./payment";

export enum TableType {
  TAKE_AWAY = "TAKE_AWAY",
  DELIVERY = "DELIVERY",
  ON_SITE = "ON_SITE",
}

export enum ShiftStatus {
  OPEN,
  CLOSE,
}

export enum LedgerAccountType {
  REVENUE = "REVENUE",
  EXPENSE = "EXPENSE",
}

export enum LedgerAccountSubtype {
  EXPENSE_MATERIALS = "EXPENSE_MATERIALS",
  EXPENSE_STAFF = "EXPENSE_STAFF",
  EXPENSE_SPACE = "EXPENSE_SPACE",
  EXPENSE_UTILITIES = "EXPENSE_UTILITIES",
  EXPENSE_MARKETING = "EXPENSE_MARKETING",
  EXPENSE_EQUIPMENT = "EXPENSE_EQUIPMENT",
  EXPENSE_MANAGEMENT = "EXPENSE_MANAGEMENT",
  EXPENSE_SAFETY = "EXPENSE_SAFETY",
  EXPENSE_OTHER = "EXPENSE_OTHER",

  REVENUE_SALES = "REVENUE_SALES",
  REVENUE_SERVICES = "REVENUE_SERVICES",
  REVENUE_OTHER = "REVENUE_OTHER",
}

export interface Table extends CreateUpdateTrace {
  id: number;
  companyId: number;
  storeId: number;
  zoneId: number | null;
  zoneName: string | null;
  name: string;
  description: string | null;
  seq: number;
  isActive: boolean;
  type: TableType;
  orders: Order[];
}

export interface Store extends CreateUpdateTrace {
  id: number;
  companyId: number;
  companyName: string;
  companyAvatar: string;
  name: string;
  phone: string;
  address: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: number;
  wardName: string;
  isActive: boolean;
}

export interface Shift extends CreateUpdateTrace {
  companyId: number;
  storeId: number;
  employeeId: number;
  employeeName: string;
  beginDate: string;
  beginAmount: number;
  endDate: string | null;
  endAmount: number;
  id: number;
  isActive: boolean;
  note: string;
  orders: Order[];
  status: ShiftStatus;
  ledgers: null;
}

export interface LedgerAccount extends Record<string, any> {}

export interface LedgerAccountReqBody {
  id?: number;
  companyId: number;
  storeId: number;
  employeeId: number;
  employeeName: string;
  type: LedgerAccountType;
  subType: LedgerAccountSubtype;
  paymentMethod: PaymentType;
  amount: number;
  note: string;
}
