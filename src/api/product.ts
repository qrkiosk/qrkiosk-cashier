import {
  CategoryWithProducts,
  Option,
  Product,
  ProductWithOptions,
} from "@/types/product";
import axios from "axios";
import { Response } from "./common";
import { BASE_URL } from "./constants";

export const getStoreProductsByCategory = (body: Record<string, any>) => {
  return axios.post<Response<CategoryWithProducts[]>>(
    `${BASE_URL}/product/category`,
    body,
  );
};

export const getProductById = (id: string) => {
  return axios.get<Response<ProductWithOptions>>(`${BASE_URL}/product/${id}`);
};

export const getProducts = (body: Record<string, any>, token: string) => {
  return axios.post<Response<Product[]>>(`${BASE_URL}/product`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProductOptions = (body: Record<string, any>, token: string) => {
  return axios.post<Response<Option[]>>(`${BASE_URL}/product/option`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
