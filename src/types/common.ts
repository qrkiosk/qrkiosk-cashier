export interface CreateUpdateTrace {
  createdBy: string;
  createdById: number;
  createdAt: string;
  updatedBy: string | null;
  updatedById: number | null;
  updatedAt: string | null;
}

export interface Base extends CreateUpdateTrace {
  companyId: number | null;
  storeId: number | null;
  totalPages: number | null;
  page: number | null;
  pageSize: number | null;
}

export enum Tab {
  TABLE = "table",
  COUNTER = "counter",
  STORE = "store",
}
