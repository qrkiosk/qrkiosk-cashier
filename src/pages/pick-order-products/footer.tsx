import Button from "@/components/button";
import {
  cartAtom,
  cartTotalAmountAtom,
  cartTotalQtyAtom,
  draftCartTotalAmountAtom,
} from "@/state/cart";
import { withThousandSeparators } from "@/utils/number";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreatingOrder = location.state?.isCreatingOrder === true;
  const totalQty = useAtomValue(cartTotalQtyAtom);
  const cartTotalAmount = useAtomValue(cartTotalAmountAtom);
  const draftCartTotalAmount = useAtomValue(draftCartTotalAmountAtom);
  const cart = useAtomValue(cartAtom);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-[--zmp-background-white] pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-col space-y-1">
          <span className="text-2xs text-subtitle">Tổng cộng ({totalQty})</span>
          <span className="text-sm font-semibold text-primary">
            {withThousandSeparators(
              isCreatingOrder ? draftCartTotalAmount : cartTotalAmount,
            )}
          </span>
        </div>
        <div className="flex max-w-[260px] items-center space-x-2">
          <Button
            disabled={isCreatingOrder && isEmpty(cart.items)}
            variant="primary"
            className="!px-4"
            onClick={() => {
              navigate(-1);
            }}
          >
            Xong
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
