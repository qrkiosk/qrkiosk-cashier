import Button from "@/components/button";
import {
  categoryTuplesAtom,
  focusedCategoryIdAtom,
  searchProductQueryAtom,
} from "@/state/product";
import classNames from "classnames";
import useEmblaCarousel from "embla-carousel-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { useEffect, useMemo, useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import "./embla.css";

const TopStickyHeader = () => {
  const [input, setInput] = useState("");
  const hasInput = !isEmpty(input);
  const [emblaRef] = useEmblaCarousel({ loop: false, dragFree: true });
  const setSearchQuery = useSetAtom(searchProductQueryAtom);
  const categoryTuples = useAtomValue(categoryTuplesAtom);
  const [focusedCategoryId, setFocusedCategoryId] = useAtom(
    focusedCategoryIdAtom,
  );

  const setSearchQueryDebounced = useMemo(
    () => debounce(setSearchQuery, 400),
    [],
  );

  useEffect(() => {
    setSearchQueryDebounced(input.trim());
  }, [input]);

  return (
    <div className="sticky left-0 right-0 top-0 z-[999] space-y-2.5 border-b-[1px] border-b-black/5 bg-white p-2">
      <div className="px-2">
        <div className="relative w-full">
          <input
            placeholder="Tìm kiếm sản phẩm"
            className="h-8 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-sm placeholder:text-inactive"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {hasInput ? (
            <Button
              variant="text"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtitle"
              onClick={() => setInput("")}
            >
              <FaXmark />
            </Button>
          ) : (
            <FaMagnifyingGlass
              fontSize={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-inactive"
            />
          )}
        </div>
      </div>

      <div
        ref={emblaRef}
        className={classNames(
          "embla scrollbar-hidden overflow-x-auto overflow-y-hidden",
          { hidden: hasInput },
        )}
      >
        <div className="embla__container space-x-1.5">
          {categoryTuples.map((catTuple, index) => (
            <div className="embla__slide space-y-1.5" key={catTuple[0].value}>
              {catTuple.map((cat) => {
                const isActive = cat.value === focusedCategoryId;
                return (
                  <div
                    key={`${cat.value}--${index}`}
                    className={classNames("embla__slide__inner", {
                      "bg-primary text-white": isActive,
                      "cursor-pointer bg-black/5 text-black active:bg-black/10":
                        !isActive,
                    })}
                    onClick={() => setFocusedCategoryId(cat.value)}
                  >
                    {cat.text}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopStickyHeader;
