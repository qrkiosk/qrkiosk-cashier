import { endShift as endShiftApi } from "@/api/company";
import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import FormError from "@/components/form/form-error";
import { useAuthorizedApi } from "@/hooks";
import { currentShiftAtom, tokenAtom } from "@/state";
import { ledgerBookQueryAtom } from "@/state/company";
import { ordersQueryAtom } from "@/state/order";
import { withThousandSeparators } from "@/utils/number";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Line from "./line";

enum FormFields {
  AMOUNT = "amount",
  NOTE = "note",
}

const EndShiftForm = () => {
  const navigate = useNavigate();
  const { data: orders } = useAtomValue(ordersQueryAtom);
  const { data: ledgerBook } = useAtomValue(ledgerBookQueryAtom);
  const [shift, setCurrentShift] = useAtom(currentShiftAtom);
  const token = useAtomValue(tokenAtom);
  const endShift = useAuthorizedApi(endShiftApi);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values: { amount: string; note: string }) => {
    if (!shift) return;

    const body = {
      id: shift.id,
      companyId: shift.companyId,
      storeId: shift.storeId,
      employeeId: shift.employeeId,
      employeeName: shift.employeeName,
      beginAmount: shift.beginAmount,
      endAmount: parseInt(values.amount),
      note: values.note,
      orders: orders.map(({ id }) => id),
      ledgers: ledgerBook.map(({ id }) => id),
    };

    try {
      await endShift(body, token);
      setCurrentShift(null);
      toast.success("Đã đóng ca làm việc.");
      navigate(-1);
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white p-4">
        <div className="grid grid-cols-6 gap-y-2">
          <Line
            left={<span className="text-sm font-semibold">Cuối ca</span>}
            mid={
              <span className="text-sm font-semibold">
                Tiền mặt: {withThousandSeparators(200000)}
              </span>
            }
          />
          <Line
            leftIndent
            left={
              <label htmlFor={FormFields.AMOUNT} className="text-sm">
                Tiền mặt thực tế:
              </label>
            }
            mid={
              <FormControl className="flex flex-1 flex-col items-end">
                <input
                  id={FormFields.AMOUNT}
                  type="number"
                  placeholder="Nhập số tiền"
                  className={classNames(
                    "h-8 w-3/4 rounded-lg bg-section pl-4 pr-3 text-xs normal-case outline-none placeholder:text-inactive",
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
              </FormControl>
            }
          />
          <Line
            leftIndent
            left={<span className="text-sm">Số tiền chênh lệch:</span>}
            mid={
              <span className="text-sm font-semibold">
                {withThousandSeparators(0)}
              </span>
            }
          />

          <FormControl className="col-span-6 space-y-2 pl-2">
            <label htmlFor={FormFields.NOTE} className="text-sm">
              Ghi chú:
            </label>
            <textarea
              id={FormFields.NOTE}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg bg-section p-4 text-sm normal-case outline-none placeholder:text-inactive"
              style={{ transition: "height none" }}
              placeholder="Nhập ghi chú"
              {...register(FormFields.NOTE)}
            />
          </FormControl>
        </div>
      </div>

      <FormControl className="flex justify-center space-x-3 p-4">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Đóng ca
        </Button>
      </FormControl>
    </form>
  );
};

export default EndShiftForm;
