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

const MainMenu = () => {
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
      {filteredCategories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          template={CategoryTemplate.GRID}
        />
      ))}
    </div>
  );
};

export default MainMenu;
