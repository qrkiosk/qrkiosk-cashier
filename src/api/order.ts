import { Order, OrderReqBody, OrderStatus } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import axios from "axios";
import { Response } from "./common";
import { BASE_URL } from "./constants";

export const getOrders = ({
  token,
  storeId,
  companyId,
}: {
  token: string;
  storeId: number;
  companyId: number;
}) => {
  return axios.post<Response<Order[]>>(
    `${BASE_URL}/order`,
    {
      filtered: [
        { id: "storeId", value: storeId },
        { id: "companyId", value: companyId },
        { id: "name", value: "" },
        { id: "fromDate", value: "2024-11-10T00:00:00.000Z" },
        { id: "toDate", value: "" },
        { id: "status", valueList: [1, 2, 3] },
      ],
      sorted: [{ id: "createdAt", asc: true }],
      pageSize: 20,
      page: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getOrder = (id: string) => {
  return axios.get<Response<Order>>(`${BASE_URL}/order/${id}`);
};

export const createOrder = (body: any, token: string) => {
  return axios.post<Response<{ id: string }>>(
    `${BASE_URL}/order/create`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const cancelOrder = (
  body: { id: string; reason: string },
  token: string,
) => {
  return axios.put<Response<unknown>>(`${BASE_URL}/order/delete`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrder = (body: OrderReqBody, token: string) => {
  return axios.put<Response<unknown>>(`${BASE_URL}/order/update`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderDetails = (body: OrderReqBody, token: string) => {
  return axios.put<Response<unknown>>(`${BASE_URL}/order/update-detail`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderStatus = (
  body: {
    id: string;
    companyId: number;
    storeId: number;
    code: string;
    isActive: boolean;
    status: OrderStatus;
    statusNew: OrderStatus;
  },
  token: string,
) => {
  return axios.put(`${BASE_URL}/order/update-status`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderPaymentStatus = (
  body: {
    id: string;
    companyId: number;
    storeId: number;
    code: string;
    isActive: boolean;
    paymentStatus: PaymentStatus;
    paymentStatusNew: PaymentStatus;
  },
  token: string,
) => {
  return axios.put(`${BASE_URL}/order/update-status-payment`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
