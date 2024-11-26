import { CreateUpdateTrace } from "./common";
import { Order } from "./order";

export enum TableType {
  TAKE_AWAY = "TAKE_AWAY",
  DELIVERY = "DELIVERY",
  ON_SITE = "ON_SITE",
}

export enum ShiftStatus {
  OPEN,
  CLOSE,
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
