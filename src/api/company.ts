import { LedgerAccount, Shift, Table } from "@/types/company";
import axios from "axios";
import { Response } from "./common";
import { BASE_URL } from "./constants";

export const getTables = (body: Record<string, any>, token: string) => {
  return axios.post<Response<{ pages: number; data: Table[] }>>(
    `${BASE_URL}/company/store/table`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const checkIsShiftOpen = (
  body: {
    companyId: number;
    storeId: number;
  },
  token: string,
) => {
  return axios.post<Response<Shift | null>>(
    `${BASE_URL}/company/store/shift/is-open`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const createShift = (
  body: {
    companyId: number;
    storeId: number;
    employeeId: number;
    employeeName: string;
    beginAmount: number;
    endAmount: number;
    note: string;
  },
  token: string,
) => {
  return axios.post<unknown>(`${BASE_URL}/company/store/shift/create`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLedgerBook = (body: Record<string, any>, token: string) => {
  return axios.post<Response<{ pages: number; data: LedgerAccount[] }>>(
    `${BASE_URL}/company/store/ledger`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
