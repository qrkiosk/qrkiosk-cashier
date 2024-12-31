import {
  LedgerAccount,
  LedgerAccountReqBody,
  Shift,
  Table,
} from "@/types/company";
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

export const endShift = (
  body: {
    id: number;
    companyId: number;
    storeId: number;
    employeeId: number;
    employeeName: string;
    beginAmount: number;
    endAmount: number;
    note: string;
    orders: string[];
    ledgers: number[];
  },
  token: string,
) => {
  return axios.put<unknown>(`${BASE_URL}/company/store/shift/close`, body, {
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

export const createLedgerAccount = (
  body: LedgerAccountReqBody,
  token: string,
) => {
  return axios.post<Response<unknown>>(
    `${BASE_URL}/company/store/ledger/create`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const updateLedgerAccount = (
  body: LedgerAccountReqBody,
  token: string,
) => {
  return axios.put<Response<unknown>>(
    `${BASE_URL}/company/store/ledger/update`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
