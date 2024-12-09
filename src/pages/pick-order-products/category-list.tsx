import { categoryTuplesAtom } from "@/state/product";
import classNames from "classnames";
import useEmblaCarousel from "embla-carousel-react";
import { useAtomValue } from "jotai";
import "./embla.css";

const CategoryList = () => {
  const [emblaRef] = useEmblaCarousel({ loop: false, dragFree: true });
  const categoryTuples = useAtomValue(categoryTuplesAtom);

  return (
    <div className="scrollbar-hidden sticky left-0 right-0 top-0 z-[999] overflow-x-auto overflow-y-hidden border-b-[1px] border-b-black/5 bg-[--zmp-background-white] p-2">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container space-x-1.5">
          {categoryTuples.map((catTuple, index) => (
            <div className="embla__slide space-y-1.5" key={index}>
              <div
                className={classNames("embla__slide__inner", {
                  active: index === 1,
                })}
              >
                {catTuple[0]}
              </div>
              <div className="embla__slide__inner">{catTuple[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
