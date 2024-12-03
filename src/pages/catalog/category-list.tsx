import CategoryTabs from "@/components/category-tabs";
import SearchBar from "@/components/search-bar";
import TransitionLink from "@/components/transition-link";
import { categoriesState } from "@/state";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const categories = useAtomValue(categoriesState);

  return (
    <>
      <div className="py-2">
        <SearchBar onClick={() => navigate("/search")} />
      </div>
      <CategoryTabs />
      <div className="grid grid-cols-4 gap-x-4 gap-y-8 p-4">
        {categories.map((category) => (
          <TransitionLink
            key={category.id}
            className="flex cursor-pointer flex-col items-center space-y-2 overflow-hidden"
            to={`/category/${category.id}`}
          >
            <img
              src={category.image}
              className="aspect-square rounded-full border-[0.5px] border-black/15 object-cover"
              alt={category.name}
            />
            <div className="line-clamp-2 w-full text-center text-sm text-subtitle">
              {category.name}
            </div>
          </TransitionLink>
        ))}
      </div>
    </>
  );
}
