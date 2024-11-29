import noop from "lodash/noop";
import { FaCirclePlus } from "react-icons/fa6";

const PriceReduction = () => {
  return (
    <div
      className="cursor-pointer bg-[--zmp-background-white] p-4"
      onClick={noop}
    >
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold">Giảm giá</span>
          {/* <span className="text-inactive">{orderNote}</span> */}
        </div>
        <FaCirclePlus fontSize={16} color="rgb(109, 109, 109)" />
      </div>
    </div>
  );
};

export default PriceReduction;
