import Button from "@/components/button";
import { Price } from "@/components/prices";
import { PrinterIcon } from "@/components/vectors";
import noop from "lodash/noop";
import CompleteOrder from "./complete-order";

const OrderFooter = () => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-[--zmp-background-white] pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-col">
          <span className="text-2xs text-subtitle">Tổng cộng ({3})</span>
          <Price
            variant="unstyled"
            size="sm"
            className="font-semibold text-primary"
          >
            {90000}
          </Price>
        </div>
        <div className="flex max-w-[260px] items-center space-x-2">
          <Button variant="secondary" className="!p-2" onClick={noop}>
            <PrinterIcon />
          </Button>
          <Button variant="secondary" className="!px-4" onClick={noop}>
            Lưu & In
          </Button>
          <CompleteOrder />
        </div>
      </div>
    </div>
  );
};

export default OrderFooter;
