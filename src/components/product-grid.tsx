import { Product } from "@/types.global";
import { HTMLAttributes } from "react";
import ProductItem from "./product-item";

export interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  products: Product[];
  replace?: boolean;
}

export default function ProductGrid({
  products,
  className,
  replace,
  ...props
}: ProductGridProps) {
  return (
    <div
      className={"grid grid-cols-2 px-4 py-2 gap-4 ".concat(className ?? "")}
      {...props}
    >
      {products.map((product) => (
        <ProductItem key={product.id} product={product} replace={replace} />
      ))}
    </div>
  );
}
