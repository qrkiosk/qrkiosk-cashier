import Divider from "@/components/section-divider";
import { CategoryTemplate, CategoryWithProducts } from "@/types/product";
import ProductsListing from "./products-listing";

const CategoryItem = ({
  category,
  template,
}: {
  category: CategoryWithProducts;
  template: CategoryTemplate;
}) => {
  return (
    <div id={category.id}>
      {(function () {
        switch (template) {
          case CategoryTemplate.BANNER:
            return <ProductsListing.Banner category={category} />;
          case CategoryTemplate.GRID:
            return <ProductsListing.Grid category={category} />;
          case CategoryTemplate.LIST:
            return <ProductsListing.List category={category} />;
          default:
            return null;
        }
      })()}
      <Divider />
    </div>
  );
};

export default CategoryItem;
