import { updateOrderDetails as updateOrderDetailsApi } from "@/api/order";
import { createPaymentTransaction as createPaymentTransactionApi } from "@/api/payment";
import Button from "@/components/button";
import { useAuthorizedApi } from "@/hooks";
import {
  currentOrderAtom,
  currentOrderQueryAtom,
  currentTableAtom,
  tablesQueryAtom,
  tokenAtom,
} from "@/state";
import { cartAtom, isCartDirtyAtom } from "@/state/cart";
import { PaymentReqBody, PaymentType } from "@/types/payment";
import { withThousandSeparators } from "@/utils/number";
import {
  buildOrderDetails,
  calcServiceFee,
  calcTotalDiscount,
  genOrderReqBody,
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
import { useAtom, useAtomValue } from "jotai";
import { isNil } from "lodash";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCalendar, FaChair, FaClock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const DEFAULT_PAYMENT_TYPE = PaymentType.COD;

const CompleteOrder = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen: on, onClose: off } = useDisclosure();
  const [paymentType, setPaymentType] = useState(DEFAULT_PAYMENT_TYPE);
  const updateOrderDetails = useAuthorizedApi(updateOrderDetailsApi);
  const createPaymentTransaction = useAuthorizedApi(
    createPaymentTransactionApi,
  );

  const token = useAtomValue(tokenAtom);
  const table = useAtomValue(currentTableAtom);
  const cart = useAtomValue(cartAtom);
  const order = useAtomValue(currentOrderAtom);
  const [isCartDirty, setIsCartDirty] = useAtom(isCartDirtyAtom);
  const { refetch: refetchCurrentOrder } = useAtomValue(currentOrderQueryAtom);
  const { refetch: refetchTables } = useAtomValue(tablesQueryAtom);

  const saveOrderChanges = async () => {
    if (!order) return;

    const details = buildOrderDetails(cart);
    try {
      await updateOrderDetails(genOrderReqBody(order, { details }), token);
      // TODO: Notify kitchen
      await refetchCurrentOrder();
      setIsCartDirty(false);
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  const onOpen = async () => {
    if (false) {
      // TODO: (await) If order is non-existent, create one right here w/ POST /order/create
      // TODO: (await) Fetch the new order to sync to currentOrderAtom
    } else if (isCartDirty) {
      await saveOrderChanges();
    }

    on();
  };

  const onClose = () => {
    // TODO: If order creation flow, cancel the newly created in onOpen order here w/ PUT /order/delete
    off();
  };

  const onSubmit = async () => {
    if (!table || !order) return;

    const data: PaymentReqBody = {
      data: {
        amount: order.totalAmount,
        method: paymentType,
      },
      info: {
        companyId: table.companyId,
        storeId: table.storeId,
        orderId: order.id,
        orderCode: order.code,
      },
    };

    try {
      await createPaymentTransaction(data, token);
      await refetchTables();
      toast.success("Đơn hàng đã được hoàn tất.");
      onClose();
      navigate(-1);
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Button variant="primary" onClick={onOpen} className="!px-4">
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
                <Radio value={PaymentType.COD}>Tiền mặt</Radio>
                <Radio value={PaymentType.BANK}>Chuyển khoản</Radio>
                <Radio value={PaymentType.MOMO}>Ví Momo</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
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
