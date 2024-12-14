import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import { useFocusedInputRef } from "@/hooks";
import { draftOrderAtom } from "@/state";
import { cartSubtotalAmountAtom } from "@/state/cart";
import { withThousandSeparators } from "@/utils/number";
import { isValidDiscountOrFee } from "@/utils/order";
import { ButtonGroup, useDisclosure } from "@chakra-ui/react";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { Modal } from "zmp-ui";

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

  const [order, setOrder] = useAtom(draftOrderAtom);
  const orderAmount = useAtomValue(cartSubtotalAmountAtom);
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

  const onSubmit = () => {
    const data = usingPercentage
      ? {
          serviceFee: Math.floor(orderAmount * inputPercentage),
          serviceFeePercentage: inputPercentage,
        }
      : {
          serviceFee: inputAmount,
          serviceFeePercentage: 0,
        };

    setOrder((prev) => ({ ...prev, ...data }));
    onClose();
  };

  const onRemoveServiceFee = () => {
    setOrder((prev) => ({
      ...prev,
      serviceFee: 0,
      serviceFeePercentage: 0,
    }));
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
              <span className="h-full text-sm">Phí trên hóa đơn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-full cursor-pointer" onClick={onOpen}>
                <span className="text-sm font-medium">
                  {isFeeAmountApplied
                    ? withThousandSeparators(feeAmount)
                    : `${Math.floor(feePercentage * 100)}%`}
                </span>
              </div>
              <Button size="sm" variant="text" onClick={onRemoveServiceFee}>
                <FaCircleMinus className="text-xl text-red-600" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal maskClosable={false} title="Phí dịch vụ" visible={isOpen}>
        <div className="space-y-6">
          <FormControl>
            <label
              className="mb-2 block text-sm font-medium"
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
