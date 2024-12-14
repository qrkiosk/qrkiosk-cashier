import { Base } from "./common";

export enum CategoryTemplate {
  BANNER = "BANNER",
  GRID = "GRID",
  LIST = "LIST",
}

export interface OptionDetail extends Base {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  productOptionId: string;
  productVariantId: string;
}

export interface Option extends Base {
  id: string;
  name: string;
  seq: number;
  isMandatory: boolean;
  isMany: boolean;
  isActive: boolean;
  details: OptionDetail[];
}

export interface OptionWithSelectedDetail extends Option {
  selectedDetail: OptionDetail | null;
  selectedDetails: OptionDetail[]; // can be empty array
}

export interface Product extends Base {
  id: string;
  name: string;
  description: string | null;
  price: number;
  priceSale: number;
  seq: number;
  url: string;
  isActive: boolean;
  categoryId: string;
  productTypeId: string;
  options: Option[];
  ptName: string;
  cname: string;
}

export interface Category extends Base {
  id: string;
  name: string;
  seq: number;
  isActive: boolean;
  template: CategoryTemplate;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface ProductWithOptions extends Product {
  options: Option[];
}

export interface BaseProductVariant extends Product {
  options: OptionWithSelectedDetail[];
}

export interface CartProductVariant extends BaseProductVariant {
  uniqIdentifier: string;
  quantity: number;
  isDone: boolean;
  serviceTaskId: string | null;
  originalOrderDetailId: string | null;
  note?: string;
}
