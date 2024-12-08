import CategoryItem from "@/components/product/category-item";
import { productsQueryAtom } from "@/state/product";
import { CategoryTemplate } from "@/types/product";
import { useAtomValue } from "jotai";

const MainMenu = () => {
  const { data: categoriesWProducts } = useAtomValue(productsQueryAtom);

  return (
    <div className="flex-1 bg-[--zmp-background-color]">
      {categoriesWProducts.map((cat) => (
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
