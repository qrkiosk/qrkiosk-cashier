import Button from "@/components/button";
import HorizontalDivider from "@/components/horizontal-divider";
import {
  categoryEntriesAtom,
  focusedCategoryIdAtom,
  searchProductQueryAtom,
} from "@/state/product";
import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { useEffect, useMemo, useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

/* For POS screen only */
const SearchAndCategories = () => {
  const [input, setInput] = useState("");
  const hasInput = !isEmpty(input);
  const setSearchQuery = useSetAtom(searchProductQueryAtom);
  const categoryEntries = useAtomValue(categoryEntriesAtom);
  const [focusedCategoryId, setFocusedCategoryId] = useAtom(
    focusedCategoryIdAtom,
  );

  const setSearchQueryDebounced = useMemo(
    () => debounce(setSearchQuery, 500),
    [],
  );

  useEffect(() => {
    setSearchQueryDebounced(input.trim());
  }, [input]);

  return (
    <>
      <div className="p-3">
        <div className="relative w-full">
          <input
            placeholder="Tìm kiếm sản phẩm"
            className="h-10 w-full rounded-lg bg-section pl-4 pr-3 text-xs normal-case outline-none placeholder:text-xs placeholder:text-inactive"
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

      <HorizontalDivider />

      <div
        className={classNames(
          "flex-1 space-y-3 overflow-y-auto p-3 transition-[opacity] ease-linear",
          { "pointer-events-none opacity-0": hasInput },
        )}
      >
        {categoryEntries.map((cat) => {
          const isActive = cat.value === focusedCategoryId;
          return (
            <div
              key={cat.value}
              className={classNames(
                "rounded-lg p-3 text-xs font-semibold transition-[background]",
                {
                  "bg-primary text-white": isActive,
                  "cursor-pointer bg-black/5 text-black active:bg-black/10":
                    !isActive,
                },
              )}
              onClick={() => setFocusedCategoryId(cat.value)}
            >
              {cat.text}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchAndCategories;
