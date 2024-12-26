import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import { PaymentType } from "@/types/payment";
import classNames from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";

enum FormFields {
  TYPE = "type",
  SUBTYPE = "subType",
  PAYMENT_METHOD = "paymentMethod",
  AMOUNT = "amount",
  NOTE = "note",
}

const IncomeForm = ({
  onSubmit,
  initialValues,
  secondaryAction,
}: {
  onSubmit: (values) => void | Promise<void>;
  initialValues?: {
    type: number;
    paymentMethod: PaymentType;
    amount: number;
    note?: string;
  };
  secondaryAction?: ReactNode;
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
      setValue(FormFields.SUBTYPE, initialValues.type);
      setValue(FormFields.PAYMENT_METHOD, initialValues.paymentMethod);
      setValue(FormFields.AMOUNT, initialValues.amount);
      setValue(FormFields.NOTE, initialValues.note ?? "");
    }
  }, [initialValues]);

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
              defaultValue={0}
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
              <option value={0}>Nguyên vật liệu</option>
              <option value={1}>Nhân sự</option>
              <option value={2}>Mặt bằng</option>
              <option value={3}>Điện nước & tiện ích</option>
              <option value={4}>Marketing</option>
              <option value={5}>Dụng cụ, thiết bị</option>
              <option value={6}>Quản lý</option>
              <option value={7}>Vệ sinh an toàn</option>
              <option value={8}>Khác</option>
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
              <option value={PaymentType.COD}>Tiền mặt</option>
              <option value={PaymentType.BANK}>Chuyển khoản</option>
              <option value={PaymentType.MOMO}>Ví Momo</option>
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
          <div className="flex h-full items-center justify-end">
            <input
              id="fee-amount"
              type="number"
              className="h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive"
              placeholder="Nhập số tiền"
              {...register(FormFields.AMOUNT)}
              // value={(inputAmount || "").toString()}
              // onChange={(e) => setInputAmount(parseInt(e.target.value))}
            />
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
          // value={input}
          // onChange={(e) => setInput(e.target.value)}
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

export default IncomeForm;
