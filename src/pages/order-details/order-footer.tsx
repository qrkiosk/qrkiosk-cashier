import { updateOrderDetails as updateOrderDetailsApi } from "@/api/order";
import Button from "@/components/button";
import { useAuthorizedApi, useResetOrderDetailsAndExitCallback } from "@/hooks";
import { currentOrderAtom, currentOrderQueryAtom, tokenAtom } from "@/state";
import {
  cartAtom,
  cartTotalAmountAtom,
  cartTotalQtyAtom,
  isCartDirtyAtom,
} from "@/state/cart";
import { withThousandSeparators } from "@/utils/number";
import { buildOrderDetails, genOrderReqBody } from "@/utils/order";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import CompleteOrder from "./complete-order";

const OrderFooter = () => {
  const updateOrderDetails = useAuthorizedApi(updateOrderDetailsApi);
  const totalQty = useAtomValue(cartTotalQtyAtom);
  const cartTotalAmount = useAtomValue(cartTotalAmountAtom);
  const order = useAtomValue(currentOrderAtom);
  const token = useAtomValue(tokenAtom);
  const isCartDirty = useAtomValue(isCartDirtyAtom);
  const cart = useAtomValue(cartAtom);
  const { refetch: refetchOrder } = useAtomValue(currentOrderQueryAtom);

  const resetOrderDetailsAndExit = useResetOrderDetailsAndExitCallback();

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-[--zmp-background-white] pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-col space-y-1">
          <span className="text-2xs text-subtitle">Tổng cộng ({totalQty})</span>
          <span className="text-sm font-semibold text-primary">
            {withThousandSeparators(cartTotalAmount)}
          </span>
        </div>
        <div className="flex max-w-[260px] items-center space-x-2">
          <Button
            disabled={!isCartDirty}
            variant="secondary"
            className="!px-4"
            onClick={async () => {
              if (!order) return;

              const details = buildOrderDetails(cart);

              try {
                await updateOrderDetails(
                  genOrderReqBody(order, { details }),
                  token,
                );
                // TODO: Notify kitchen
                await refetchOrder();

                toast.success("Thông báo đơn hàng cho bar/bếp thành công.");
                resetOrderDetailsAndExit();
              } catch {
                toast.error(
                  "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                );
              }
            }}
          >
            Lưu
          </Button>
          <CompleteOrder />
        </div>
      </div>
    </div>
  );
};

export default OrderFooter;
