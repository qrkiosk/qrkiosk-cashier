import { updateOrder as updateOrderApi } from "@/api/order";
import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import { use401ErrorFlag, useFocusedInputRef } from "@/hooks";
import { currentOrderAtom, currentOrderQueryAtom, tokenAtom } from "@/state";
import { withErrorStatusCodeHandler } from "@/utils/error";
import { withThousandSeparators } from "@/utils/number";
import { genOrderReqBody, isValidDiscountOrFee } from "@/utils/order";
import { ButtonGroup, useDisclosure } from "@chakra-ui/react";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { Modal } from "zmp-ui";

const calcFeeAmount = (orderPrice: number, feePercentage: number) =>
  Math.floor(orderPrice * feePercentage);

const calcAppliedPriceByPercentage = (
  orderPrice: number,
  feePercentage: number,
) => Math.floor(orderPrice * (1 + feePercentage));

const calcAppliedPriceByAmount = (orderPrice: number, feeAmount: number) =>
  orderPrice + feeAmount;

const useUpdateOrderWith401Handler = () => {
  const { escalate: escalate401Error } = use401ErrorFlag();
  return withErrorStatusCodeHandler(updateOrderApi, [
    { statusCode: 401, handler: escalate401Error },
  ]);
};

const ServiceFee = () => {
  const { isOpen, onOpen, onClose: off } = useDisclosure();
  const [inputAmount, setInputAmount] = useState(0);
  const [inputPercentage, setInputPercentage] = useState(0);
  const [usingPercentage, setUsingPercentage] = useState(false);

  const refAmount = useFocusedInputRef<HTMLInputElement>(
    isOpen && !usingPercentage,
  );
  const refPercentage = useFocusedInputRef<HTMLInputElement>(
    isOpen && usingPercentage,
  );

  const order = useAtomValue(currentOrderAtom);
  const orderPrice = order?.totalAmount ?? 0;
  const feeAmount = order?.serviceFee ?? 0;
  const feePercentage = order?.serviceFeePercentage ?? 0;

  const isFeeAmountApplied =
    isValidDiscountOrFee(feeAmount) && !isValidDiscountOrFee(feePercentage);
  const isFeePercentageApplied =
    isValidDiscountOrFee(feeAmount) && isValidDiscountOrFee(feePercentage);
  const isFeeApplied = isFeeAmountApplied || isFeePercentageApplied;

  const onClose = useCallback(() => {
    setInputAmount(0);
    setInputPercentage(0);
    off();
  }, []);

  const token = useAtomValue(tokenAtom);
  const updateOrder = useUpdateOrderWith401Handler();
  const { refetch } = useAtomValue(currentOrderQueryAtom);

  const onSubmit = async () => {
    if (!order) return;

    try {
      const updatedData = usingPercentage
        ? {
            serviceFee: calcFeeAmount(orderPrice, inputPercentage),
            serviceFeePercentage: inputPercentage,
          }
        : {
            serviceFee: inputAmount,
            serviceFeePercentage: 0,
          };

      await updateOrder(genOrderReqBody(order, updatedData), token);
      await refetch();
      onClose();
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  const onRemoveDiscount = async () => {
    if (!order) return;

    try {
      await updateOrder(
        genOrderReqBody(order, {
          serviceFee: 0,
          serviceFeePercentage: 0,
        }),
        token,
      );
      await refetch();
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (isFeeAmountApplied) {
      setInputAmount(feeAmount);
      setUsingPercentage(false);
    } else if (isFeePercentageApplied) {
      setInputPercentage(feePercentage);
      setUsingPercentage(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (usingPercentage) {
      setInputAmount(0);
    } else {
      setInputPercentage(0);
    }
  }, [usingPercentage]);

  return (
    <>
      <div className="space-y-3 bg-[--zmp-background-white] p-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Phí dịch vụ</p>
          {!isFeeApplied && (
            <Button size="md" variant="text" onClick={onOpen}>
              <FaCirclePlus className="text-xl text-green-600" />
            </Button>
          )}
        </div>

        {isFeeApplied && (
          <div className="flex items-center justify-between">
            <div className="h-full flex-1 cursor-pointer" onClick={onOpen}>
              <span className="h-full text-xs">Phí trên hóa đơn</span>
            </div>
            <div className="flex items-center space-x-2">
              {isFeeAmountApplied && (
                <>
                  <div className="h-full cursor-pointer" onClick={onOpen}>
                    <span className="font-medium">
                      {withThousandSeparators(feeAmount)}
                    </span>
                  </div>
                  <Button size="sm" variant="text" onClick={onRemoveDiscount}>
                    <FaCircleMinus className="text-xl text-red-600" />
                  </Button>
                </>
              )}
              {isFeePercentageApplied && (
                <>
                  <div className="h-full cursor-pointer" onClick={onOpen}>
                    <span className="font-medium">
                      {Math.floor(feePercentage * 100)}%
                    </span>
                  </div>
                  <Button size="sm" variant="text" onClick={onRemoveDiscount}>
                    <FaCircleMinus className="text-xl text-red-600" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal maskClosable={false} title="Phí dịch vụ" visible={isOpen}>
        <div className="space-y-4">
          <FormControl>
            <label
              className="mb-2 block font-medium"
              htmlFor={usingPercentage ? "fee-percentage" : "fee-amount"}
            >
              Giá trị
            </label>

            <div className="relative">
              <input
                id="fee-percentage"
                ref={refPercentage}
                type="number"
                className={classNames(
                  "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
                  { hidden: !usingPercentage },
                )}
                placeholder="Nhập % phí (1 - 100)"
                value={(Math.floor(inputPercentage * 100) || "").toString()}
                onChange={(e) => {
                  setInputPercentage(
                    Math.floor(parseInt(e.target.value) || 0) / 100,
                  );
                }}
              />
              <input
                id="fee-amount"
                ref={refAmount}
                type="number"
                className={classNames(
                  "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
                  { hidden: usingPercentage },
                )}
                placeholder="Nhập số tiền"
                value={(inputAmount || "").toString()}
                onChange={(e) =>
                  setInputAmount(Math.floor(parseInt(e.target.value) || 0))
                }
              />

              <ButtonGroup
                isAttached
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <Button
                  size="sm"
                  variant={usingPercentage ? "secondary" : "primary"}
                  className={classNames("rounded-md", {
                    "border border-gray-300 active:bg-gray-300":
                      usingPercentage,
                    "border border-primary": !usingPercentage,
                  })}
                  onClick={() => setUsingPercentage(false)}
                >
                  VND
                </Button>
                <Button
                  size="sm"
                  variant={usingPercentage ? "primary" : "secondary"}
                  className={classNames("rounded-md", {
                    "border border-primary": usingPercentage,
                    "border border-gray-300 active:bg-gray-300":
                      !usingPercentage,
                  })}
                  onClick={() => setUsingPercentage(true)}
                >
                  %
                </Button>
              </ButtonGroup>
            </div>
          </FormControl>

          <div className="flex items-center justify-between">
            <span className="mb-2 block font-medium">
              Số tiền sau áp dụng phí:
            </span>
            <span className="mb-2 block font-medium">
              {withThousandSeparators(
                usingPercentage
                  ? calcAppliedPriceByPercentage(orderPrice, inputPercentage)
                  : calcAppliedPriceByAmount(orderPrice, inputAmount),
              )}
            </span>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={
                !isValidDiscountOrFee(inputAmount) &&
                !isValidDiscountOrFee(inputPercentage)
              }
            >
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceFee;