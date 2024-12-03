import ProductGrid from "@/components/product-grid";
import { productsState } from "@/state";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export interface RelatedProductsProps {
  currentProductId: number;
}

export default function RelatedProducts(props: RelatedProductsProps) {
  const products = useAtomValue(productsState);
  const otherProducts = useMemo(
    () => products.filter((product) => product.id !== props.currentProductId),
    [products, props.currentProductId],
  );

  return <ProductGrid replace products={otherProducts} />;
}
