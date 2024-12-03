import { Customer } from "@/types/customer";
import axios from "axios";
import { Response } from "./common";
import { BASE_URL } from "./constants";

export const getCustomers = (body: Record<string, any>, token: string) => {
  return axios.post<Response<Customer[]>>(`${BASE_URL}/customer`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCustomer = (
  body: {
    companyId: number;
    storeId: number;
    name: string;
    phoneNumber: string;
  },
  token: string,
) => {
  return axios.post<Response<unknown>>(`${BASE_URL}/customer/add`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCustomer = (
  body: {
    id: string;
    companyId: number;
    storeId: number;
    name: string;
    phoneNumber: string;
  },
  token: string,
) => {
  return axios.put<Response<unknown>>(`${BASE_URL}/customer/update`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
