import HorizontalDivider from "@/components/horizontal-divider";
import ProductGrid from "@/components/product-grid";
import { productsState } from "@/state";
import { useAtomValue } from "jotai";
import ProductFilter from "./product-filter";

export default function ProductListPage() {
  const products = useAtomValue(productsState);

  return (
    <>
      <ProductFilter />
      <HorizontalDivider />
      <ProductGrid products={products} className="pb-[13px] pt-4" />
    </>
  );
}
