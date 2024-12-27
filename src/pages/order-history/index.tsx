import Button from "@/components/button";
import EmptyState from "@/components/empty-state";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import OrderItem from "@/components/order/order-item";
import Divider from "@/components/section-divider";
import { withThousandSeparators } from "@/utils/number";
import { useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";
import { compact } from "lodash";
import isEmpty from "lodash/isEmpty";
import { Fragment, useState } from "react";
import {
  FaCreditCard,
  FaMagnifyingGlass,
  FaPenToSquare,
} from "react-icons/fa6";
import { Sheet } from "zmp-ui";

const OrderHistoryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const [order, setOrder] = useState({
    id: 1,
    amount: 10000,
    orderCode: "1423",
    tableName: "A1",
    customerName: "Tiến",
    paymentMethod: "COD",
    note: "ít đường",
    createdAt: dayjs().toISOString(),
  });
  // const displayOrderItems = useMemo(
  //   () => convertOrderToCart(order).items,
  //   [order],
  // );
  const displayOrderItems = [];

  return (
    <>
      <FlexDiv col className="!p-0">
        <div className="flex items-center space-x-2 border-b-[1px] border-b-black/5 bg-white p-4">
          <div className="relative w-3/4">
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
          <div className="w-1/4">
            <select
              className="h-10 w-full rounded-lg bg-section px-1.5 text-xs normal-case outline-none placeholder:text-inactive"
              defaultValue="1"
            >
              <option value="1">Tất cả</option>
              <option value="2">Chưa th.toán</option>
              <option value="3">Đã th.toán</option>
            </select>
          </div>
        </div>

        {isEmpty([1]) ? (
          <EmptyState message="Không có dữ liệu." />
        ) : (
          <div className="bg-white">
            {[
              {
                id: 1,
                amount: 10000,
                orderCode: "1423",
                tableName: "A1",
                customerName: "Tiến",
                paymentMethod: "COD",
                note: "ít đường",
                createdAt: dayjs().toISOString(),
              },
              {
                id: 2,
                amount: 10000,
                orderCode: "1423",
                tableName: "A1",
                customerName: "Tiến",
                paymentMethod: "COD",
                note: "ít đường",
                createdAt: dayjs().toISOString(),
              },
            ].map((record) => (
              <Fragment key={record.id}>
                <div className="space-y-1 px-5 py-4" onClick={onOpen}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary">
                      <FaCreditCard />
                      <span className="font-semibold text-primary">
                        {withThousandSeparators(record.amount)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {dayjs(record.createdAt).format("HH:mm DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer">
                      <p className="text-xs text-subtitle">
                        {compact([
                          record.tableName,
                          record.orderCode,
                          record.customerName,
                          record.note,
                        ]).join(" • ")}
                      </p>
                      <p className="text-xs text-subtitle">
                        {record.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center pl-3">
                      <Button size="sm" variant="text" onClick={() => {}}>
                        <FaPenToSquare
                          className="text-subtitle"
                          fontSize={16}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
                <HorizontalDivider />
              </Fragment>
            ))}
          </div>
        )}
      </FlexDiv>

      <Sheet visible={isOpen} onClose={onClose}>
        <FlexDiv col className="!p-0">
          {/* <Divider /> */}
          <div className="flex cursor-pointer items-center space-x-3 bg-white p-4">
            <span className="font-semibold">Khách hàng</span>
            <span className="text-sm text-inactive">{order?.customerName}</span>
          </div>

          <Divider />
          <div className="flex cursor-pointer items-center space-x-3 bg-white p-4">
            <span className="font-semibold">Ghi chú đơn</span>
            <span className="text-sm text-inactive">{order?.note}</span>
          </div>

          <Divider />
          <div className="space-y-3 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Giảm giá</p>
            </div>

            {
              /* isDiscountApplied */ true && (
                <div className="flex items-center justify-between">
                  <div
                    className="h-full flex-1 cursor-pointer"
                    onClick={onOpen}
                  >
                    <span className="h-full text-sm">Giảm giá hóa đơn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {
                      /* isDiscountAmountApplied */ false && (
                        <div className="h-full cursor-pointer" onClick={onOpen}>
                          <span className="text-sm font-medium text-green-600">
                            -{withThousandSeparators(/* discountAmount */ 1000)}
                          </span>
                        </div>
                      )
                    }
                    {
                      /* isDiscountPercentageApplied */ true && (
                        <div className="h-full cursor-pointer" onClick={onOpen}>
                          <span className="text-sm font-medium text-green-600">
                            -{Math.floor(/* discountPercentage */ 0.15 * 100)}%
                          </span>
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            }
          </div>

          <Divider />
          <div className="space-y-3 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Phí dịch vụ</p>
            </div>

            {
              /* isFeeApplied */ true && (
                <div className="flex items-center justify-between">
                  <div
                    className="h-full flex-1 cursor-pointer"
                    onClick={onOpen}
                  >
                    <span className="h-full text-sm">Phí trên hóa đơn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {
                      /* isFeeAmountApplied */ true && (
                        <div className="h-full cursor-pointer" onClick={onOpen}>
                          <span className="text-sm font-medium">
                            {withThousandSeparators(/* feeAmount */ 1000)}
                          </span>
                        </div>
                      )
                    }
                    {
                      /* isFeePercentageApplied */ false && (
                        <div className="h-full cursor-pointer" onClick={onOpen}>
                          <span className="text-sm font-medium">
                            {Math.floor(/* feePercentage */ 0.1 * 100)}%
                          </span>
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            }
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
              <span className="text-sm font-semibold">
                Hình thức thanh toán
              </span>
              <span className="text-sm font-semibold">Tiền mặt</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tổng tiền • 2 món</span>
              <span className="font-semibold text-primary">
                {withThousandSeparators(/* feeAmount */ 1000)}
              </span>
            </div>
          </div>
        </div>
      </Sheet>
    </>
  );
};

export default OrderHistoryPage;
