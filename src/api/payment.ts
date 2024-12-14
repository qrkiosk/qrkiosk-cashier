import { PaymentReqBody } from "@/types/payment";
import axios from "axios";
import { Response } from "./common";
import { BASE_URL } from "./constants";

export const createPaymentTransaction = (
  body: PaymentReqBody,
  token: string,
) => {
  return axios.post<Response<unknown>>(`${BASE_URL}/payment/create`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
