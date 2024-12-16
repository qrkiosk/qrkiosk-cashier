import { updateOrder as updateOrderApi } from "@/api/order";
import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import { useAuthorizedApi, useFocusedInputRef } from "@/hooks";
import { currentOrderAtom, currentOrderQueryAtom, tokenAtom } from "@/state";
import { withThousandSeparators } from "@/utils/number";
import { genOrderReqBody, isValidDiscountOrFee } from "@/utils/order";
import { ButtonGroup, useDisclosure } from "@chakra-ui/react";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { Modal } from "zmp-ui";

const PriceReduction = () => {
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
  const orderAmount = order?.amount ?? 0;
  const discountAmount = order?.discountAmount ?? 0;
  const discountPercentage = order?.discountPercentage ?? 0;

  const isDiscountAmountApplied =
    isValidDiscountOrFee(discountAmount) &&
    !isValidDiscountOrFee(discountPercentage);
  const isDiscountPercentageApplied =
    isValidDiscountOrFee(discountAmount) &&
    isValidDiscountOrFee(discountPercentage);
  const isDiscountApplied =
    isDiscountAmountApplied || isDiscountPercentageApplied;

  const onClose = useCallback(() => {
    setInputAmount(0);
    setInputPercentage(0);
    off();
  }, []);

  const token = useAtomValue(tokenAtom);
  const updateOrder = useAuthorizedApi(updateOrderApi);
  const { refetch } = useAtomValue(currentOrderQueryAtom);

  const onSubmit = async () => {
    if (!order) return;

    try {
      const updatedData = usingPercentage
        ? {
            discountAmount: Math.floor(orderAmount * inputPercentage),
            discountPercentage: inputPercentage,
          }
        : {
            discountAmount: inputAmount,
            discountPercentage: 0,
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
          discountAmount: 0,
          discountPercentage: 0,
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

    if (isDiscountAmountApplied) {
      setInputAmount(discountAmount);
      setUsingPercentage(false);
    } else if (isDiscountPercentageApplied) {
      setInputPercentage(discountPercentage);
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
          <p className="font-semibold">Giảm giá</p>
          {!isDiscountApplied && (
            <Button size="md" variant="text" onClick={onOpen}>
              <FaCirclePlus className="text-xl text-green-600" />
            </Button>
          )}
        </div>

        {isDiscountApplied && (
          <div className="flex items-center justify-between">
            <div className="h-full flex-1 cursor-pointer" onClick={onOpen}>
              <span className="h-full text-sm">Giảm giá hóa đơn</span>
            </div>
            <div className="flex items-center space-x-2">
              {isDiscountAmountApplied && (
                <>
                  <div className="h-full cursor-pointer" onClick={onOpen}>
                    <span className="text-sm font-medium text-green-600">
                      -{withThousandSeparators(discountAmount)}
                    </span>
                  </div>
                  <Button size="sm" variant="text" onClick={onRemoveDiscount}>
                    <FaCircleMinus className="text-xl text-red-600" />
                  </Button>
                </>
              )}
              {isDiscountPercentageApplied && (
                <>
                  <div className="h-full cursor-pointer" onClick={onOpen}>
                    <span className="text-sm font-medium text-green-600">
                      -{Math.floor(discountPercentage * 100)}%
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

      <Modal maskClosable={false} title="Giảm giá hóa đơn" visible={isOpen}>
        <div className="space-y-6">
          <FormControl>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor={
                usingPercentage ? "discount-percentage" : "discount-amount"
              }
            >
              Giá trị
            </label>

            <div className="relative">
              <input
                id="discount-percentage"
                ref={refPercentage}
                type="number"
                className={classNames(
                  "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
                  { hidden: !usingPercentage },
                )}
                placeholder="Nhập % giảm (1 - 100)"
                value={(Math.floor(inputPercentage * 100) || "").toString()}
                onChange={(e) => {
                  setInputPercentage(
                    Math.floor(parseInt(e.target.value) || 0) / 100,
                  );
                }}
              />
              <input
                id="discount-amount"
                ref={refAmount}
                type="number"
                className={classNames(
                  "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
                  { hidden: usingPercentage },
                )}
                placeholder="Nhập số tiền giảm"
                value={(inputAmount || "").toString()}
                onChange={(e) => setInputAmount(parseInt(e.target.value) || 0)}
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

export default PriceReduction;
