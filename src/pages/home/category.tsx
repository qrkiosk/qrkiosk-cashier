import Section from "@/components/section";
import TransitionLink from "@/components/transition-link";
import { categoriesState } from "@/state";
import { useAtomValue } from "jotai";

export default function Category() {
  const categories = useAtomValue(categoriesState);

  return (
    <Section title="Danh mục sản phẩm" viewMoreTo="/categories">
      <div className="flex space-x-6 overflow-x-auto px-4 pb-4 pt-2.5">
        {categories.map((category) => (
          <TransitionLink
            key={category.id}
            className="flex flex-none basis-[70px] cursor-pointer flex-col items-center space-y-2 overflow-hidden"
            to={`/category/${category.id}`}
          >
            <img
              src={category.image}
              className="h-[70px] w-[70px] rounded-full border-[0.5px] border-black/15 object-cover"
              alt={category.name}
            />
            <div className="line-clamp-2 w-full text-center text-sm text-subtitle">
              {category.name}
            </div>
          </TransitionLink>
        ))}
      </div>
    </Section>
  );
}
