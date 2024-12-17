import { createOrder as createOrderApi } from "@/api/order";
import Button from "@/components/button";
import { useAuthorizedApi, useResetDraftOrderAndExitCallback } from "@/hooks";
import { currentTableAtom, draftOrderAtom, tokenAtom } from "@/state";
import {
  cartAtom,
  cartTotalQtyAtom,
  draftCartTotalAmountAtom,
} from "@/state/cart";
import { OrderStatus } from "@/types/order";
import { ShippingType } from "@/types/shipping";
import { withThousandSeparators } from "@/utils/number";
import { buildOrderDetails } from "@/utils/order";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import CompleteOrder from "./complete-order";

const OrderFooter = () => {
  const createOrder = useAuthorizedApi(createOrderApi);
  const token = useAtomValue(tokenAtom);
  const totalQty = useAtomValue(cartTotalQtyAtom);
  const cartTotalAmount = useAtomValue(draftCartTotalAmountAtom);
  const order = useAtomValue(draftOrderAtom);
  const cart = useAtomValue(cartAtom);
  const table = useAtomValue(currentTableAtom);

  const resetDraftOrderAndExit = useResetDraftOrderAndExitCallback();

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
            disabled={isEmpty(cart.items)}
            variant="secondary"
            className="!px-4"
            onClick={async () => {
              if (!table || isEmpty(order.customer)) {
                toast.error("Bạn chưa chọn khách hàng.");
                return;
              }

              const details = buildOrderDetails(cart);
              const body = {
                id: order.id ?? null,
                companyId: table.companyId,
                storeId: table.storeId,
                tableId: table.id,
                tableName: table.name,
                customer: !isEmpty(order.customer) ? order.customer : null,
                paymentType: null,
                sourceType: ShippingType.ON_SITE,
                note: order.note ?? "",
                discountAmount: order.discountAmount ?? 0,
                discountPercentage: order.discountPercentage ?? 0,
                discountVoucher: order.discountVoucher ?? 0,
                serviceFee: order.serviceFee ?? 0,
                serviceFeePercentage: order.serviceFeePercentage ?? 0,
                status: OrderStatus.PROCESS,
                isActive: true,
                details,
              };

              try {
                await createOrder(body, token);
                // TODO: (await) Notify kitchen

                toast.success("Thông báo đơn hàng cho bar/bếp thành công.");
                resetDraftOrderAndExit();
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
