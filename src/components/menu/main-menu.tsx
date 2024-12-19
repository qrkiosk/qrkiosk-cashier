import {
  filteredCategoriesAtom,
  searchProductQueryAtom,
} from "@/state/product";
import { CategoryTemplate } from "@/types/product";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import CategoryItem from "./category-item";

const MainMenu = () => {
  const searchQuery = useAtomValue(searchProductQueryAtom);
  const filteredCategories = useAtomValue(filteredCategoriesAtom);

  return (
    <div
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
