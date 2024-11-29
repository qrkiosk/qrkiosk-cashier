import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import FormError from "@/components/form/form-error";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";

enum FormFields {
  NAME = "name",
  PHONE = "phone",
}

const CustomerForm = ({
  isOpen,
  onSubmit,
  initialValues,
  secondaryAction,
}: {
  isOpen: boolean;
  onSubmit: (values) => Promise<void>;
  initialValues?: { name: string; phone: string };
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
      setValue(FormFields.NAME, initialValues.name);
      setValue(FormFields.PHONE, initialValues.phone);
    }
  }, [initialValues]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <label htmlFor={FormFields.NAME} className="mb-2 block font-medium">
          Họ tên
        </label>
        <input
          id={FormFields.NAME}
          type="text"
          placeholder="Nhập họ tên"
          className={classNames(
            "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
            {
              "border-2 border-red-500": !isEmpty(errors[FormFields.NAME]),
            },
          )}
          {...register(FormFields.NAME, {
            required: "Đây là trường bắt buộc.",
          })}
        />
        <FormError error={errors[FormFields.NAME]} />
      </FormControl>

      <FormControl>
        <label htmlFor={FormFields.PHONE} className="mb-2 block font-medium">
          Số điện thoại
        </label>
        <input
          id={FormFields.PHONE}
          type="tel"
          placeholder="Nhập số điện thoại"
          className={classNames(
            "h-10 w-full rounded-lg bg-section pl-4 pr-3 text-sm normal-case outline-none placeholder:text-inactive",
            {
              "border-2 border-red-500": !isEmpty(errors[FormFields.PHONE]),
            },
          )}
          {...register(FormFields.PHONE, {
            required: "Đây là trường bắt buộc.",
            minLength: { value: 10, message: "Tối thiểu 10 chữ số." },
          })}
        />
        <FormError error={errors[FormFields.PHONE]} />
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

export default CustomerForm;
