import EmptyState from "@/components/empty-state";
import {
  searchProductQueryAtom,
  searchProductResultsAtom,
} from "@/state/product";
import { CategoryTemplate } from "@/types/product";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef } from "react";
import CategoryItem from "./category-item";

const SearchResult = ({
  template = CategoryTemplate.GRID,
  readOnly = false,
  updateAvailabilityMode = false,
}: {
  template?: CategoryTemplate;
  readOnly?: boolean;
  updateAvailabilityMode?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const searchQuery = useAtomValue(searchProductQueryAtom);
  const searchResults = useAtomValue(searchProductResultsAtom);

  useEffect(() => {
    if (!isEmpty(searchQuery)) {
      ref.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [searchQuery]);

  if (isEmpty(searchResults)) {
    return <EmptyState message="Không có sản phẩm bạn tìm kiếm." />;
  }

  return (
    <div
      ref={ref}
      className={classNames("flex-1 overflow-y-auto", {
        hidden: isEmpty(searchQuery),
      })}
    >
      {searchResults.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          template={template}
          readOnly={readOnly}
          updateAvailabilityMode={updateAvailabilityMode}
        />
      ))}
    </div>
  );
};

export default SearchResult;
