import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import FormError from "@/components/form/form-error";
import { LedgerAccountSubtype } from "@/types/company";
import { PaymentType } from "@/types/payment";
import { toDisplayPaymentMethod } from "@/utils/payment";
import classNames from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";

enum FormFields {
  SUBTYPE = "subType",
  PAYMENT_METHOD = "paymentMethod",
  AMOUNT = "amount",
  NOTE = "note",
}

const ExpenseForm = ({
  isOpen,
  onSubmit,
  initialValues,
  secondaryAction,
  isEdit = false,
}: {
  isOpen: boolean;
  onSubmit: (values) => void | Promise<void>;
  initialValues?: {
    subType: number;
    paymentMethod: PaymentType;
    amount: number;
    note?: string;
  };
  secondaryAction?: ReactNode;
  isEdit?: boolean;
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (initialValues) {
      setValue(FormFields.SUBTYPE, initialValues.subType);
      setValue(FormFields.PAYMENT_METHOD, initialValues.paymentMethod);
      setValue(FormFields.AMOUNT, initialValues.amount);
      setValue(FormFields.NOTE, initialValues.note ?? "");
    }
  }, [initialValues]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-y-2">
        <div className="col-span-1">
          <div className="flex h-full items-center">
            <span className="text-sm">Thời gian:</span>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex h-full items-center justify-end">
            <span className="text-sm font-semibold">
              {dayjs().format("HH:mm DD/MM/YYYY")}
            </span>
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex h-full items-center">
            <label htmlFor={FormFields.SUBTYPE} className="text-sm">
              Loại:
            </label>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex h-full items-center justify-end">
            <select
              id={FormFields.SUBTYPE}
              defaultValue={LedgerAccountSubtype.EXPENSE_MATERIALS}
              disabled={isEdit}
              className={classNames(
                "h-10 w-full rounded-lg bg-section px-1.5 text-xs normal-case outline-none placeholder:text-inactive",
                {
                  "border-2 border-red-500": !isEmpty(
                    errors[FormFields.SUBTYPE],
                  ),
                },
              )}
              {...register(FormFields.SUBTYPE)}
            >
              <option value={LedgerAccountSubtype.EXPENSE_MATERIALS}>
                Nguyên vật liệu
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_STAFF}>
                Nhân sự
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_SPACE}>
                Mặt bằng
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_UTILITIES}>
                Điện nước & tiện ích
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_MARKETING}>
                Marketing
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_EQUIPMENT}>
                Dụng cụ, thiết bị
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_MANAGEMENT}>
                Quản lý
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_SAFETY}>
                Vệ sinh an toàn
              </option>
              <option value={LedgerAccountSubtype.EXPENSE_OTHER}>Khác</option>
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex h-full items-center">
            <label htmlFor={FormFields.PAYMENT_METHOD} className="text-sm">
              Phương thức:
            </label>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex h-full items-center justify-end">
            <select
              id={FormFields.PAYMENT_METHOD}
              defaultValue={PaymentType.COD}
              disabled={isEdit}
              className={classNames(
                "h-10 w-full rounded-lg bg-section px-1.5 text-xs normal-case outline-none placeholder:text-inactive",
                {
                  "border-2 border-red-500": !isEmpty(
                    errors[FormFields.PAYMENT_METHOD],
                  ),
                },
              )}
              {...register(FormFields.PAYMENT_METHOD)}
            >
              {[PaymentType.COD, PaymentType.BANK, PaymentType.MOMO].map(
                (item) => (
                  <option value={item}>{toDisplayPaymentMethod(item)}</option>
                ),
              )}
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex h-full items-center">
            <label htmlFor={FormFields.AMOUNT} className="text-sm">
              Số tiền:
            </label>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex h-full flex-col items-center justify-end">
            <input
              id="fee-amount"
              type="number"
              placeholder="Nhập số tiền"
              className={classNames(
                "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
                {
                  "border-2 border-red-500": !isEmpty(
                    errors[FormFields.AMOUNT],
                  ),
                },
              )}
              {...register(FormFields.AMOUNT, {
                required: "Đây là trường bắt buộc.",
              })}
            />
            <FormError error={errors[FormFields.AMOUNT]} />
          </div>
        </div>
      </div>

      <FormControl className="space-y-1">
        <label htmlFor={FormFields.NOTE} className="text-sm">
          Ghi chú:
        </label>
        <textarea
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-lg bg-section p-4 text-sm normal-case outline-none placeholder:text-inactive"
          style={{ transition: "height none" }}
          placeholder="Nhập ghi chú"
          {...register(FormFields.NOTE)}
        />
      </FormControl>

      <div className="flex justify-end space-x-2">
        {secondaryAction}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Lưu
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
