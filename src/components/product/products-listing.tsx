import { updateProductStock as updateProductStockApi } from "@/api/product";
import { useAuthorizedApi, useDeviceMode } from "@/hooks";
import { tokenAtom } from "@/state";
import {
  CategoryWithProducts,
  UpdateProductStockReqBody,
} from "@/types/product";
import { Box, Heading, Divider as LineDivider } from "@chakra-ui/react";
import classNames from "classnames";
import useEmblaCarousel from "embla-carousel-react";
import { useAtomValue } from "jotai";
import React, { forwardRef } from "react";
import toast from "react-hot-toast";
import { Switch } from "zmp-ui";
import ProductItem from "./product-item";

type CommonProductListingProps = {
  category: CategoryWithProducts;
  scrollMargin?: number | undefined;
};

const ProductsListing = {} as {
  Banner: React.ForwardRefExoticComponent<
    CommonProductListingProps & React.RefAttributes<HTMLDivElement>
  >;
  Grid: React.ForwardRefExoticComponent<
    CommonProductListingProps & React.RefAttributes<HTMLDivElement>
  >;
  List: React.ForwardRefExoticComponent<
    CommonProductListingProps &
      React.RefAttributes<HTMLDivElement> & {
        readOnly?: boolean;
        updateAvailabilityMode?: boolean;
      }
  >;
};

ProductsListing.Banner = forwardRef(({ category, scrollMargin }, ref) => {
  const [emblaRef] = useEmblaCarousel({ dragFree: true });

  return (
    <div className="bg-white py-5">
      <Box ref={ref} id={category.id} scrollMarginTop={scrollMargin} />
      <Heading as="p" size="md" fontWeight="semibold" px={6} mt={1} mb={2}>
        {category.name}
      </Heading>
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {category.products.map((product) => (
              <div key={product.id} className="embla__slide">
                <ProductItem.Banner product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductsListing.Grid = forwardRef(({ category, scrollMargin }, ref) => {
  const device = useDeviceMode();

  return (
    <div className="bg-white px-6 py-5">
      <Box ref={ref} id={category.id} scrollMarginTop={scrollMargin} />
      <Heading as="p" size="md" fontWeight="semibold" mt={1} mb={4}>
        {category.name}
      </Heading>
      <div
        className={classNames("grid", {
          "grid-cols-2 gap-4": device === "mobile",
          "grid-cols-3 gap-6": device === "tablet",
        })}
      >
        {category.products.map((product) => (
          <ProductItem.Grid key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
});

ProductsListing.List = forwardRef(
  (
    {
      category,
      scrollMargin,
      readOnly = false,
      updateAvailabilityMode = false,
    },
    ref,
  ) => {
    const updateProductStock = useAuthorizedApi(updateProductStockApi);
    const token = useAtomValue(tokenAtom);

    return (
      <div className="bg-white px-6 py-5">
        <Box ref={ref} id={category.id} scrollMarginTop={scrollMargin} />
        <Heading as="p" size="md" fontWeight="semibold" mt={1} mb={4}>
          {category.name}
        </Heading>
        <div className="flex flex-col">
          {category.products.map((product, idx) => {
            const isLast = idx === category.products.length - 1;

            return (
              <div key={product.id}>
                <div className="flex">
                  <div className="flex-1">
                    <ProductItem.List
                      product={product}
                      readOnly={readOnly}
                      simple={updateAvailabilityMode}
                    />
                  </div>

                  {updateAvailabilityMode && (
                    <Switch
                      defaultChecked={product.isStock}
                      onChange={async (e) => {
                        const isProductInStock = e.target.checked;
                        const body: UpdateProductStockReqBody = {
                          id: product.id,
                          companyId: product.companyId,
                          storeId: product.storeId,
                          name: product.name,
                          price: product.price,
                          seq: product.seq,
                          url: product.url,
                          categoryId: product.categoryId,
                          productTypeId: product.productTypeId,
                          isActive: product.isActive,
                          isStock: isProductInStock,
                        };

                        try {
                          await updateProductStock(body, token);
                        } catch {
                          toast.error(
                            "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                          );
                        }
                      }}
                    />
                  )}
                </div>

                {!isLast && <LineDivider my={4} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

export default ProductsListing;
