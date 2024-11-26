import axios from "axios";

import { Order, OrderStatus } from "../types/order";
import { PaymentStatus } from "../types/payment";
import { BASE_URL } from "./constants";
import { Response } from "./common";

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
    }
  );
};

export const updateOrderStatus = ({
  token,
  id,
  status,
  statusNew,
}: {
  token: string;
  id: string;
  status: OrderStatus;
  statusNew: OrderStatus;
}) => {
  return axios.put(
    `${BASE_URL}/order/update-status`,
    { id, status, statusNew },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateOrderPaymentStatus = ({
  token,
  id,
  paymentStatus,
  paymentStatusNew,
}: {
  token: string;
  id: string;
  paymentStatus: PaymentStatus;
  paymentStatusNew: PaymentStatus;
}) => {
  return axios.put(
    `${BASE_URL}/order/update-status-payment`,
    { id, paymentStatus, paymentStatusNew },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
