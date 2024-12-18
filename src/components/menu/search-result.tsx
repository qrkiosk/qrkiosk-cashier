import ProductsListing from "@/components/product/products-listing";
import Divider from "@/components/section-divider";
import {
  searchProductQueryAtom,
  searchProductResultsAtom,
} from "@/state/product";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { Fragment, useEffect, useRef } from "react";

const SearchResult = () => {
  const ref = useRef<HTMLDivElement>(null);
  const searchQuery = useAtomValue(searchProductQueryAtom);
  const searchResults = useAtomValue(searchProductResultsAtom);

  useEffect(() => {
    if (!isEmpty(searchQuery)) {
      ref.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [searchQuery]);

  return (
    <div
      className={classNames("flex-1 overflow-y-auto", {
        hidden: isEmpty(searchQuery),
      })}
      ref={ref}
    >
      {searchResults.map((category) => (
        <Fragment key={category.id}>
          <ProductsListing.Grid category={category} />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

export default SearchResult;
