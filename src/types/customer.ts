import { CreateUpdateTrace } from "./common";

export interface Customer extends CreateUpdateTrace {
  companyId: number;
  storeId: number;
  id: string;
  name: string;
  phoneNumber?: string;
  totalPages: number;
  page: number;
  pageSize: number;
}
