import FlexDiv from "@/components/flex-div";
import OrderItem from "@/components/order/order-item";
import Divider from "@/components/section-divider";
import { Order } from "@/types/order";
import { convertOrderToCart } from "@/utils/cart";
import { withThousandSeparators } from "@/utils/number";
import { isValidDiscountOrFee } from "@/utils/order";
import { useMemo } from "react";
import { Sheet } from "zmp-ui";

const OrderDetailsSheet = ({
  order,
  isOpen,
  onClose,
}: {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const discountAmount = order.discountAmount ?? 0;
  const discountPercentage = order.discountPercentage ?? 0;

  const isDiscountAmountApplied =
    isValidDiscountOrFee(discountAmount) &&
    !isValidDiscountOrFee(discountPercentage);
  const isDiscountPercentageApplied = isValidDiscountOrFee(discountPercentage);
  const isDiscountApplied =
    isDiscountAmountApplied || isDiscountPercentageApplied;

  const feeAmount = order?.serviceFee ?? 0;
  const feePercentage = order?.serviceFeePercentage ?? 0;

  const isFeeAmountApplied =
    isValidDiscountOrFee(feeAmount) && !isValidDiscountOrFee(feePercentage);
  const isFeePercentageApplied = isValidDiscountOrFee(feePercentage);
  const isFeeApplied = isFeeAmountApplied || isFeePercentageApplied;

  const displayOrderItems = useMemo(
    () => convertOrderToCart(order).items,
    [order],
  );

  return (
    <Sheet visible={isOpen} onClose={onClose}>
      <FlexDiv col className="!p-0">
        <div className="flex items-center space-x-3 bg-white p-4">
          <span className="font-semibold">Khách hàng</span>
          <span className="text-sm text-inactive">{order.customerName}</span>
        </div>

        <Divider />
        <div className="flex items-center space-x-3 bg-white p-4">
          <span className="font-semibold">Ghi chú đơn</span>
          <span className="text-sm text-inactive">{order.note}</span>
        </div>

        <Divider />
        <div className="space-y-3 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Giảm giá</p>
          </div>

          {isDiscountApplied && (
            <div className="flex items-center justify-between">
              <div className="h-full flex-1">
                <span className="h-full text-sm">Giảm giá hóa đơn</span>
              </div>
              <div className="flex items-center space-x-2">
                {isDiscountAmountApplied && (
                  <div className="h-full">
                    <span className="text-sm font-medium text-green-600">
                      -{withThousandSeparators(discountAmount)}
                    </span>
                  </div>
                )}
                {isDiscountPercentageApplied && (
                  <div className="h-full">
                    <span className="text-sm font-medium text-green-600">
                      -{Math.floor(discountPercentage)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Divider />
        <div className="space-y-3 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Phí dịch vụ</p>
          </div>

          {isFeeApplied && (
            <div className="flex items-center justify-between">
              <div className="h-full flex-1">
                <span className="h-full text-sm">Phí trên hóa đơn</span>
              </div>
              <div className="flex items-center space-x-2">
                {isFeeAmountApplied && (
                  <div className="h-full">
                    <span className="text-sm font-medium">
                      {withThousandSeparators(feeAmount)}
                    </span>
                  </div>
                )}
                {isFeePercentageApplied && (
                  <div className="h-full">
                    <span className="text-sm font-medium">
                      {Math.floor(feePercentage)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Divider />
        <div className="space-y-4 bg-white px-4 py-3">
          <p className="font-semibold">Sản phẩm</p>

          <div className="grid-g grid grid-cols-3 gap-y-4">
            {displayOrderItems.map((item) => (
              <OrderItem key={item.uniqIdentifier} item={item} readOnly />
            ))}
          </div>
        </div>

        <Divider />
      </FlexDiv>

      <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-white pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Hình thức thanh toán</span>
            <span className="text-sm font-semibold">{order.paymentType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              Tổng tiền • {order.totalQuantity} món
            </span>
            <span className="font-semibold text-primary">
              {withThousandSeparators(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </Sheet>
  );
};

export default OrderDetailsSheet;
