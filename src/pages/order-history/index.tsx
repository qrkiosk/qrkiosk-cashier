import Button from "@/components/button";
import EmptyState from "@/components/empty-state";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import { ordersQueryAtom } from "@/state/order";
import { Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { withThousandSeparators } from "@/utils/number";
import { searchOrders } from "@/utils/search";
import { useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { compact } from "lodash";
import isEmpty from "lodash/isEmpty";
import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCreditCard,
  FaMagnifyingGlass,
  FaPenToSquare,
} from "react-icons/fa6";
import { Spinner } from "zmp-ui";
import OrderDetailsSheet from "./order-details-sheet";

type PaymentFilter = "ALL" | "INCOMPLETE" | "COMPLETE";

const OrderHistoryPage = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("ALL");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const {
    data: orders,
    isLoading,
    error,
    refetch: refetchOrders,
  } = useAtomValue(ordersQueryAtom);

  const filteredOrders = useMemo(() => {
    const paymentFilteredOrders = orders.filter((order) => {
      switch (paymentFilter) {
        case "INCOMPLETE":
          return [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID].includes(
            order.paymentStatus,
          );
        case "COMPLETE":
          return order.paymentStatus === PaymentStatus.PAID;
        case "ALL":
        default:
          return true;
      }
    });

    if (isEmpty(search)) {
      return paymentFilteredOrders;
    }
    return searchOrders(search, paymentFilteredOrders);
  }, [orders, paymentFilter, search]);

  if (isLoading) {
    return (
      <FlexDiv row center>
        <Spinner />
      </FlexDiv>
    );
  }

  if (error) {
    return (
      <FlexDiv col center className="space-y-4">
        <p className="text-sm text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await refetchOrders();
            } catch {
              toast.error("Xảy ra lỗi khi tải dữ liệu.");
            }
          }}
        >
          Tải lại
        </Button>
      </FlexDiv>
    );
  }

  return (
    <>
      {selectedOrder && (
        <OrderDetailsSheet
          order={selectedOrder}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}

      <FlexDiv col className="!p-0">
        <div className="flex items-center space-x-2 border-b-[1px] border-b-black/5 bg-white p-4">
          <div className="relative w-3/4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value as PaymentFilter);
              }}
            >
              <option value="ALL">Tất cả</option>
              <option value="INCOMPLETE">Chưa th.toán</option>
              <option value="COMPLETE">Đã th.toán</option>
            </select>
          </div>
        </div>

        {isEmpty(filteredOrders) ? (
          <EmptyState message="Không có dữ liệu." />
        ) : (
          <div className="bg-white">
            {filteredOrders.map((order) => (
              <Fragment key={order.id}>
                <div
                  className="space-y-1 px-5 py-4"
                  onClick={() => {
                    setSelectedOrder(order);
                    setTimeout(onOpen);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary">
                      <FaCreditCard />
                      <span className="font-semibold text-primary">
                        {withThousandSeparators(order.amount)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {dayjs(order.createdAt).format("HH:mm DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-subtitle">
                        {compact([
                          order.tableName,
                          order.code,
                          order.customerName,
                          order.note,
                        ]).join(" • ")}
                      </p>
                      <p className="text-xs text-subtitle">
                        {order.paymentType}
                      </p>
                    </div>
                    <div className="flex items-center pl-3">
                      <Button
                        size="sm"
                        variant="text"
                        onClick={() => {
                          setSelectedOrder(order);
                          setTimeout(onOpen);
                        }}
                      >
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
    </>
  );
};

export default OrderHistoryPage;
