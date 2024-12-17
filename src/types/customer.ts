import { CreateUpdateTrace } from "./common";

export interface Customer extends CreateUpdateTrace {
  companyId: number;
  storeId: number;
  id: string;
  name: string;
  phoneNumber?: string;
  isDefault: boolean;
  totalPages: number;
  page: number;
  pageSize: number;
}
