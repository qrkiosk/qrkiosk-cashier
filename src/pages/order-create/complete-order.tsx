import {
  cancelOrder as cancelOrderApi,
  createOrder as createOrderApi,
  getOrder,
} from "@/api/order";
import { createPaymentTransaction as createPaymentTransactionApi } from "@/api/payment";
import Button from "@/components/button";
import { useAuthorizedApi, useResetDraftOrderAndExitCallback } from "@/hooks";
import { currentTableAtom, draftOrderAtom, tokenAtom } from "@/state";
import { cartAtom } from "@/state/cart";
import { Order, OrderStatus } from "@/types/order";
import { PaymentReqBody, PaymentType } from "@/types/payment";
import { ShippingType } from "@/types/shipping";
import { withThousandSeparators } from "@/utils/number";
import {
  buildOrderDetails,
  calcServiceFee,
  calcTotalDiscount,
} from "@/utils/order";
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
import { useAtomValue } from "jotai";
import { isNil } from "lodash";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCalendar, FaChair, FaClock } from "react-icons/fa6";

const DEFAULT_PAYMENT_TYPE = PaymentType.COD;

const CompleteOrder = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentType, setPaymentType] = useState(DEFAULT_PAYMENT_TYPE);
  const createOrder = useAuthorizedApi(createOrderApi);
  const cancelOrder = useAuthorizedApi(cancelOrderApi);
  const createPaymentTransaction = useAuthorizedApi(
    createPaymentTransactionApi,
  );

  const token = useAtomValue(tokenAtom);
  const table = useAtomValue(currentTableAtom);
  const draftOrder = useAtomValue(draftOrderAtom);
  const cart = useAtomValue(cartAtom);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const resetDraftOrderAndExit = useResetDraftOrderAndExitCallback();

  const saveNewOrder = async () => {
    if (!table || isEmpty(draftOrder.customer)) {
      toast.error("Bạn chưa chọn khách hàng.");
      return null;
    }

    const details = buildOrderDetails(cart);
    const body = {
      id: draftOrder.id ?? null,
      companyId: table.companyId,
      storeId: table.storeId,
      tableId: table.id,
      tableName: table.name,
      customer: !isEmpty(draftOrder.customer) ? draftOrder.customer : null,
      paymentType: null,
      sourceType: ShippingType.ON_SITE,
      note: draftOrder.note ?? "",
      discountAmount: draftOrder.discountAmount ?? 0,
      discountPercentage: draftOrder.discountPercentage ?? 0,
      discountVoucher: draftOrder.discountVoucher ?? 0,
      serviceFee: draftOrder.serviceFee ?? 0,
      serviceFeePercentage: draftOrder.serviceFeePercentage ?? 0,
      status: OrderStatus.PROCESS,
      isActive: true,
      details,
    };

    try {
      const res = await createOrder(body, token);
      // TODO: (await) Notify kitchen

      return res.data;
    } catch {
      toast.error("Khởi tạo đơn hàng không thành công.");
      return null;
    }
  };

  const onOpenPayment = async () => {
    const createOrderRes = await saveNewOrder();

    if (createOrderRes) {
      const { data: getOrderRes } = await getOrder(createOrderRes.data.id);
      setCreatedOrder(getOrderRes.data);
      onOpen();
    }
  };

  const onCancelPayment = async () => {
    if (createdOrder) {
      await cancelOrder(
        { id: createdOrder.id, reason: "Cashier canceled payment." },
        token,
      );
      setCreatedOrder(null);
    }
    onClose();
  };

  const onSubmit = async () => {
    if (!table || !createdOrder) return;

    const data: PaymentReqBody = {
      data: {
        amount: createdOrder.totalAmount,
        method: paymentType,
      },
      info: {
        companyId: table.companyId,
        storeId: table.storeId,
        orderId: createdOrder.id,
        orderCode: createdOrder.code,
      },
    };

    try {
      await createPaymentTransaction(data, token);

      toast.success("Đơn hàng đã được xác nhận thanh toán.");
      onClose();
      resetDraftOrderAndExit();
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={onOpenPayment}
        disabled={isEmpty(cart.items)}
        className="!px-4"
      >
        Thanh toán
      </Button>

      <Modal
        isCentered
        closeOnOverlayClick={false}
        size={{ base: "sm", sm: "md" }}
        isOpen={isOpen}
        onClose={onCancelPayment}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thanh toán</ModalHeader>

          <ModalBody className="!p-0">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center space-x-1">
                <FaChair />
                <span className="text-sm font-semibold">
                  {[table?.zoneName, table?.name].join(", ")}
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

            {!isNil(createdOrder) && (
              <div className="grid grid-cols-2 gap-y-4 px-6 py-3">
                <div className="col-span-1">
                  <div className="flex h-full items-center">
                    <span className="text-sm">Tổng tiền hàng</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex h-full items-center justify-end">
                    <span className="text-sm">
                      {withThousandSeparators(createdOrder.amount ?? 0)}
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
                        calcTotalDiscount(createdOrder, createdOrder.amount),
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
                        calcServiceFee(createdOrder, createdOrder.amount),
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
                      {withThousandSeparators(createdOrder.totalAmount ?? 0)}
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
                <Radio value={PaymentType.COD}>Tiền mặt</Radio>
                <Radio value={PaymentType.BANK}>Chuyển khoản</Radio>
                <Radio value={PaymentType.MOMO}>Ví Momo</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter className="space-x-2">
            <Button variant="secondary" onClick={onCancelPayment}>
              Hủy
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Thanh toán
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompleteOrder;
