import {
  filteredCategoriesAtom,
  focusedCategoryIdAtom,
  searchProductQueryAtom,
} from "@/state/product";
import { CategoryTemplate } from "@/types/product";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef } from "react";
import CategoryItem from "./category-item";

const MainMenu = ({
  template = CategoryTemplate.GRID,
  readOnly = false,
  updateAvailabilityMode = false,
}: {
  template?: CategoryTemplate;
  readOnly?: boolean;
  updateAvailabilityMode?: boolean;
}) => {
  const searchQuery = useAtomValue(searchProductQueryAtom);
  const filteredCategories = useAtomValue(filteredCategoriesAtom);
  const focusedCategoryId = useAtomValue(focusedCategoryIdAtom);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollTo({ top: 0, behavior: "instant" });
    });
  }, [focusedCategoryId]);

  return (
    <div
      ref={ref}
      className={classNames("flex-1 overflow-y-auto", {
        hidden: !isEmpty(searchQuery),
      })}
    >
      {filteredCategories.map((category) => (
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

export default MainMenu;
