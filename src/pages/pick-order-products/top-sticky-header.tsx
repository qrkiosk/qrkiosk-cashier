import { categoryTuplesAtom, searchProductQueryAtom } from "@/state/product";
import classNames from "classnames";
import useEmblaCarousel from "embla-carousel-react";
import { atom, useAtom, useAtomValue } from "jotai";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { useEffect, useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "./embla.css";

const inputAtom = atom("");

const TopStickyHeader = () => {
  const [emblaRef] = useEmblaCarousel({ loop: false, dragFree: true });
  const categoryTuples = useAtomValue(categoryTuplesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchProductQueryAtom);
  const [input, setInput] = useState("");

  const setSearchQueryDebounced = useMemo(
    () => debounce(setSearchQuery, 500),
    [],
  );

  useEffect(() => {
    setSearchQueryDebounced(input.trim());
  }, [input]);

  return (
    <div className="scrollbar-hidden sticky left-0 right-0 top-0 z-[999] space-y-2.5 overflow-x-auto overflow-y-hidden border-b-[1px] border-b-black/5 bg-[--zmp-background-white] p-2">
      <div className="px-2">
        <div className="relative w-full">
          <input
            placeholder="Tìm kiếm sản phẩm"
            className="h-8 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-sm placeholder:text-inactive"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <FaMagnifyingGlass
            fontSize={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-inactive"
          />
        </div>
      </div>

      <div
        ref={emblaRef}
        className={classNames("embla", { hidden: !isEmpty(searchQuery) })}
      >
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

export default TopStickyHeader;