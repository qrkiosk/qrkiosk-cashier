import {
  cancelOrder as cancelOrderApi,
  updateOrderDetails as updateOrderDetailsApi,
  updateOrderStatus as updateOrderStatusApi,
} from "@/api/order";
import Button from "@/components/button";
import { useAuthorizedApi, useResetOrderDetailsAndExitCallback } from "@/hooks";
import {
  currentOrderAtom,
  currentOrderQueryAtom,
  isOrderPaidAtom,
  isOrderWaitingAtom,
  tokenAtom,
} from "@/state";
import {
  cartAtom,
  cartSubtotalAmountAtom,
  cartTotalAmountAtom,
  cartTotalQtyAtom,
  isCartDirtyAtom,
} from "@/state/cart";
import { OrderStatus } from "@/types/order";
import { withThousandSeparators } from "@/utils/number";
import {
  buildOrderDetails,
  calcDiscountAmount,
  calcDiscountVoucher,
  calcServiceFee,
  genOrderReqBody,
} from "@/utils/order";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import toast from "react-hot-toast";
import CompleteOrder from "./complete-order";

const OrderFooter = () => {
  const updateOrderDetails = useAuthorizedApi(updateOrderDetailsApi);
  const updateOrderStatus = useAuthorizedApi(updateOrderStatusApi);
  const cancelOrder = useAuthorizedApi(cancelOrderApi);
  const token = useAtomValue(tokenAtom);
  const totalQty = useAtomValue(cartTotalQtyAtom);
  const order = useAtomValue(currentOrderAtom);
  const orderTotalAmount = order?.totalAmount;
  const cartTotalAmount = useAtomValue(cartTotalAmountAtom);
  const isCartDirty = useAtomValue(isCartDirtyAtom);
  const cart = useAtomValue(cartAtom);
  const { refetch: refetchOrder } = useAtomValue(currentOrderQueryAtom);
  const isOrderWaiting = useAtomValue(isOrderWaitingAtom);
  const isOrderPaid = useAtomValue(isOrderPaidAtom);
  const newCartSubtotalAmount = useAtomValue(cartSubtotalAmountAtom);

  const totalAmount = useMemo(() => {
    if (!orderTotalAmount || isCartDirty) {
      return cartTotalAmount;
    }
    return orderTotalAmount;
  }, [orderTotalAmount, cartTotalAmount, isCartDirty]);

  const resetOrderDetailsAndExit = useResetOrderDetailsAndExitCallback();

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-white pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-col space-y-1">
          <span className="text-2xs text-subtitle">Tổng cộng ({totalQty})</span>
          <span className="text-sm font-semibold text-primary">
            {withThousandSeparators(totalAmount)}
          </span>
        </div>
        <div className="flex max-w-[260px] items-center space-x-2">
          {isOrderWaiting && !isOrderPaid && (
            <Button
              variant="secondary"
              onClick={async () => {
                if (!order) return;

                try {
                  await cancelOrder(
                    { id: order.id, reason: "Cashier canceled order." },
                    token,
                  );
                  toast.success("Đã hủy đơn thanh toán trả sau.");
                  resetOrderDetailsAndExit();
                } catch {
                  toast.error(
                    "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                  );
                }
              }}
              className="!px-4"
            >
              Hủy
            </Button>
          )}

          {isOrderWaiting && (
            <Button
              variant="primary"
              onClick={async () => {
                if (!order) return;

                try {
                  await updateOrderStatus(
                    {
                      id: order.id,
                      companyId: order.companyId,
                      storeId: order.storeId,
                      code: order.code,
                      isActive: order.isActive,
                      status: order.status,
                      statusNew: OrderStatus.PROCESS,
                    },
                    token,
                  );
                  // TODO: (await) Notify kitchen

                  if (isOrderPaid) {
                    resetOrderDetailsAndExit();
                    toast.success("Đã xác nhận đơn thanh toán trả trước.");
                  } else {
                    await refetchOrder();
                    toast.success("Đã xác nhận đơn thanh toán trả sau.");
                  }
                } catch {
                  toast.error(
                    "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                  );
                }
              }}
              className="!px-4"
            >
              Xác nhận
            </Button>
          )}

          {!isOrderWaiting && (
            <>
              <Button
                disabled={!isCartDirty}
                variant="secondary"
                className="!px-4"
                onClick={async () => {
                  if (!order) return;

                  const details = buildOrderDetails(cart);
                  const body = genOrderReqBody(order, {
                    details,
                    discountVoucher: calcDiscountVoucher(order),
                    discountAmount: calcDiscountAmount(
                      order,
                      newCartSubtotalAmount,
                    ),
                    serviceFee: calcServiceFee(order, newCartSubtotalAmount),
                  });

                  try {
                    await updateOrderDetails(body, token);
                    // TODO: (await) Notify kitchen

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFooter;
