// import {
//   categoryIdInViewAtom,
//   headerRefAtom,
//   mainContentRefAtom,
//   setCategoryRefsMapAtom,
// } from "@/state";
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
  // const scrollIntoViewRef = useRef<HTMLDivElement>(null);
  // const observeIntersectionRef = useRef<HTMLDivElement>(null);
  // const setCategoryRefsMap = useSetAtom(setCategoryRefsMapAtom);
  // const mainContentRef = useAtomValue(mainContentRefAtom);
  // const headerRef = useAtomValue(headerRefAtom);
  // const setCategoryIdInView = useSetAtom(categoryIdInViewAtom);

  // useEffect(() => {
  //   setCategoryRefsMap(category.id, scrollIntoViewRef);
  // }, [scrollIntoViewRef]);

  // useEffect(() => {
  //   const categoryElement = observeIntersectionRef.current;
  //   const mainContentElement = mainContentRef?.current;
  //   const headerElement = headerRef?.current;

  //   if (!categoryElement || !mainContentElement || !headerElement) {
  //     return;
  //   }

  //   const mainContentH = mainContentElement.clientHeight;
  //   const headerH = headerElement.clientHeight;

  //   if (!mainContentH || !headerH) {
  //     return;
  //   }

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         setCategoryIdInView(category.id);
  //       }
  //     },
  //     {
  //       root: mainContentElement,
  //       rootMargin: `-${headerH}px 0px -${mainContentH - headerH}px 0px`,
  //     },
  //   );

  //   observer.observe(categoryElement);
  // }, [mainContentRef?.current?.clientHeight, headerRef?.current?.clientHeight]);

  return (
    <div /* ref={observeIntersectionRef} */>
      {(function () {
        switch (template) {
          case CategoryTemplate.BANNER:
            return (
              <ProductsListing.Banner
                category={category}
                // ref={scrollIntoViewRef}
                // scrollMargin={headerRef?.current?.clientHeight}
              />
            );
          case CategoryTemplate.GRID:
            return (
              <ProductsListing.Grid
                category={category}
                // ref={scrollIntoViewRef}
                // scrollMargin={headerRef?.current?.clientHeight}
              />
            );
          case CategoryTemplate.LIST:
            return (
              <ProductsListing.List
                category={category}
                // ref={scrollIntoViewRef}
                // scrollMargin={headerRef?.current?.clientHeight}
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
