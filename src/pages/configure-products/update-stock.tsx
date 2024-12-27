import EmptyState from "@/components/empty-state";
import FlexDiv from "@/components/flex-div";
import ProductItem from "@/components/product/product-item";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Switch } from "zmp-ui";

const UpdateStock = () => {
  const [input, setInput] = useState("");

  return (
    <FlexDiv col className="!p-0">
      <div className="flex items-center space-x-2 border-b-[1px] border-b-black/5 bg-white p-4">
        <div className="relative w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tìm kiếm"
            className="h-10 w-full rounded-lg bg-section pl-4 pr-3 text-xs normal-case outline-none placeholder:text-2xs placeholder:text-inactive"
          />
          <FaMagnifyingGlass
            fontSize={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-inactive"
          />
        </div>
      </div>

      {isEmpty([1]) ? (
        <EmptyState message="Không có dữ liệu." />
      ) : (
        <div className="bg-white">
          {[].map((product) => (
            <div className="flex items-center">
              <ProductItem.List key={product.id} product={product} readOnly />
              <Switch size="small" />
            </div>
          ))}
        </div>
      )}
    </FlexDiv>
  );
};

export default UpdateStock;
