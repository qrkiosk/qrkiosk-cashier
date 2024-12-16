import Button from "@/components/button";
import {
  clearPickerBagAtom,
  mergePickerBagIntoCartAtom,
  pickerBagAtom,
  pickerBagTotalAmountAtom,
  pickerBagTotalQtyAtom,
} from "@/state/cart";
import { withThousandSeparators } from "@/utils/number";
import { useAtomValue, useSetAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const pickerBag = useAtomValue(pickerBagAtom);
  const totalQty = useAtomValue(pickerBagTotalQtyAtom);
  const totalAmount = useAtomValue(pickerBagTotalAmountAtom);
  const clearPickerBag = useSetAtom(clearPickerBagAtom);
  const mergePickerBagToCart = useSetAtom(mergePickerBagIntoCartAtom);

  useEffect(
    () => () => {
      clearPickerBag();
    },
    [],
  );

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-[--zmp-background-white] pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-col space-y-1">
          <span className="text-2xs text-subtitle">Tổng cộng ({totalQty})</span>
          <span className="text-sm font-semibold text-primary">
            {withThousandSeparators(totalAmount)}
          </span>
        </div>
        <div className="flex max-w-[260px] items-center space-x-2">
          <Button
            disabled={isEmpty(pickerBag)}
            variant="secondary"
            className="!px-4"
            onClick={clearPickerBag}
          >
            Chọn lại
          </Button>
          <Button
            disabled={isEmpty(pickerBag)}
            variant="primary"
            className="!px-4"
            onClick={() => {
              mergePickerBagToCart();
              navigate(-1);
            }}
          >
            Thêm vào đơn ({pickerBag.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
