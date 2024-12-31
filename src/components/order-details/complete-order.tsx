import {
  updateOrderDetails as updateOrderDetailsApi,
  updateOrderPaymentStatus as updateOrderPaymentStatusApi,
} from "@/api/order";
import { createPaymentTransaction as createPaymentTransactionApi } from "@/api/payment";
import Button from "@/components/button";
import { useAuthorizedApi, useResetOrderDetailsAndExitCallback } from "@/hooks";
import {
  currentOrderAtom,
  currentOrderQueryAtom,
  currentTableAtom,
  isOrderPaidAtom,
  tokenAtom,
} from "@/state";
import {
  cartAtom,
  cartSubtotalAmountAtom,
  isCartDirtyAtom,
} from "@/state/cart";
import { PaymentStatus, PaymentType } from "@/types/payment";
import { UserRole } from "@/types/user";
import { withThousandSeparators } from "@/utils/number";
import {
  buildOrderDetails,
  calcDiscountAmount,
  calcDiscountVoucher,
  calcServiceFee,
  calcTotalDiscount,
  genOrderReqBody,
} from "@/utils/order";
import { toDisplayPaymentMethod } from "@/utils/payment";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { isNil } from "lodash";
import compact from "lodash/compact";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCalendar, FaChair, FaClock } from "react-icons/fa6";

const DEFAULT_PAYMENT_TYPE = PaymentType.COD;

const CompleteOrder = () => {
  const { isOpen, onOpen: on, onClose } = useDisclosure();
  const [paymentType, setPaymentType] = useState(DEFAULT_PAYMENT_TYPE);
  const updateOrderDetails = useAuthorizedApi(updateOrderDetailsApi);
  const updateOrderPaymentStatus = useAuthorizedApi(
    updateOrderPaymentStatusApi,
  );
  const createPaymentTransaction = useAuthorizedApi(
    createPaymentTransactionApi,
  );

  const token = useAtomValue(tokenAtom);
  const table = useAtomValue(currentTableAtom);
  const cart = useAtomValue(cartAtom);
  const order = useAtomValue(currentOrderAtom);
  const isOrderPaid = useAtomValue(isOrderPaidAtom);
  const [isCartDirty, setIsCartDirty] = useAtom(isCartDirtyAtom);
  const { refetch: refetchOrder } = useAtomValue(currentOrderQueryAtom);
  const newCartSubtotalAmount = useAtomValue(cartSubtotalAmountAtom);

  const resetOrderDetailsAndExit = useResetOrderDetailsAndExitCallback();

  const saveOrderChanges = async () => {
    if (!order) return;

    const details = buildOrderDetails(cart);
    const body = genOrderReqBody(order, {
      details,
      discountVoucher: calcDiscountVoucher(order),
      discountAmount: calcDiscountAmount(order, newCartSubtotalAmount),
      serviceFee: calcServiceFee(order, newCartSubtotalAmount),
    });

    try {
      await updateOrderDetails(body, token);
      // TODO: (await) Notify kitchen
      await refetchOrder();
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  const onOpen = async () => {
    if (isCartDirty) {
      await saveOrderChanges();
      setIsCartDirty(false);
    }
    on();
  };

  const onSubmit = async () => {
    if (!order || isOrderPaid) return;

    if (order.createdByRole === UserRole.CUSTOMER) {
      const body = {
        id: order.id,
        companyId: order.companyId,
        storeId: order.storeId,
        code: order.code,
        isActive: order.isActive,
        paymentStatus: order.paymentStatus,
        paymentStatusNew: PaymentStatus.PAID,
      };

      try {
        await updateOrderPaymentStatus(body, token);
        toast.success("Đơn hàng đã được xác nhận thanh toán.");
        onClose();
        resetOrderDetailsAndExit();
      } catch {
        toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
      }
    } else {
      const body = {
        data: {
          amount: order.totalAmount,
          method: paymentType,
        },
        info: {
          companyId: order.companyId,
          storeId: order.storeId,
          orderId: order.id,
          orderCode: order.code,
        },
      };

      try {
        await createPaymentTransaction(body, token);
        toast.success("Đơn hàng đã được xác nhận thanh toán.");
        onClose();
        resetOrderDetailsAndExit();
      } catch {
        toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={onOpen}
        className="!px-4"
        disabled={isOrderPaid}
      >
        Thanh toán
      </Button>

      <Modal
        isCentered
        closeOnOverlayClick={false}
        size={{ base: "sm", sm: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thanh toán</ModalHeader>

          <ModalBody className="!p-0">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center space-x-1">
                <FaChair />
                <span className="text-sm font-semibold">
                  {compact([table?.zoneName, table?.name]).join(", ")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FaCalendar />
                  <span className="text-sm font-semibold">
                    {dayjs().format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaClock />
                  <span className="text-sm font-semibold">
                    {dayjs().format("HH:mm")}
                  </span>
                </div>
              </div>
            </div>

            {!isNil(order) && (
              <div className="grid grid-cols-2 gap-y-4 px-6 py-3">
                <div className="col-span-1">
                  <div className="flex h-full items-center">
                    <span className="text-sm">Tổng tiền hàng</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex h-full items-center justify-end">
                    <span className="text-sm">
                      {withThousandSeparators(order.amount ?? 0)}
                    </span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="flex h-full items-center">
                    <span className="text-sm">Giảm giá</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex h-full items-center justify-end">
                    <span className="text-sm">
                      {withThousandSeparators(
                        calcTotalDiscount(order, order.amount),
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="flex h-full items-center">
                    <span className="text-sm">Phí dịch vụ</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex h-full items-center justify-end">
                    <span className="text-sm">
                      {withThousandSeparators(
                        calcServiceFee(order, order.amount),
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="flex h-full items-center">
                    <span className="text-sm font-bold">Khách cần trả</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex h-full items-center justify-end">
                    <span className="text-sm font-bold">
                      {withThousandSeparators(order.totalAmount ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[--zmp-background-color]">
              <p className="px-6 pb-1 pt-3 text-xs text-subtitle">
                PHƯƠNG THỨC THANH TOÁN
              </p>
            </div>

            <RadioGroup
              size="sm"
              className="px-6 py-2"
              defaultValue={PaymentType.COD}
              value={paymentType}
              onChange={(v: PaymentType) => setPaymentType(v)}
            >
              <Stack direction="column" spacing={1.5}>
                {[PaymentType.COD, PaymentType.BANK, PaymentType.MOMO].map(
                  (item) => (
                    <Radio value={item}>{toDisplayPaymentMethod(item)}</Radio>
                  ),
                )}
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary" onClick={onSubmit} disabled={isOrderPaid}>
              Thanh toán
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompleteOrder;
