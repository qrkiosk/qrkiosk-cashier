import { CategoryWithProducts, ProductWithOptions } from "@/types/product";
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
