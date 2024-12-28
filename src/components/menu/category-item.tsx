import ProductsListing from "@/components/product/products-listing";
import Divider from "@/components/section-divider";
import { CategoryTemplate, CategoryWithProducts } from "@/types/product";

const CategoryItem = ({
  category,
  template,
  readOnly = false,
  updateAvailabilityMode = false,
}: {
  category: CategoryWithProducts;
  template: CategoryTemplate;
  readOnly?: boolean;
  updateAvailabilityMode?: boolean;
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
            return (
              <ProductsListing.List
                category={category}
                readOnly={readOnly}
                updateAvailabilityMode={updateAvailabilityMode}
              />
            );
          default:
            return null;
        }
      })()}
      <Divider />
    </div>
  );
};

export default CategoryItem;
