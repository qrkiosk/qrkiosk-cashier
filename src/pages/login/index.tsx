import { authenticate } from "@/api/login";
import Button from "@/components/button";
import FormControl from "@/components/form/form-control";
import FormError from "@/components/form/form-error";
import { authResultAtom } from "@/state";
import { Container } from "@chakra-ui/react";
import { AxiosError } from "axios";
import classNames from "classnames";
import { useSetAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useBoolean } from "usehooks-ts";

enum FormFields {
  USERNAME = "username",
  PASSWORD = "password",
}

const LoginForm = () => {
  const navigate = useNavigate();
  const { value: isPasswordVisible, toggle } = useBoolean();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const setAuthResult = useSetAtom(authResultAtom);

  const onSubmit = async (values) => {
    try {
      const authResult = await authenticate(values);

      setAuthResult(authResult.data.data);
      navigate("/menu-table", { replace: true });
    } catch (error) {
      if ((error as AxiosError).status === 401) {
        toast.error(
          "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra và thử lại.",
        );
      } else {
        toast.error("Xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center space-y-6 p-5">
        <FormControl>
          <label
            htmlFor={FormFields.USERNAME}
            className="mb-2 block font-semibold"
          >
            Tên người dùng
          </label>
          <input
            id={FormFields.USERNAME}
            autoCapitalize="off"
            type="text"
            placeholder="Nhập tên người dùng"
            className={classNames(
              "h-12 w-full rounded-lg bg-section pl-4 pr-3 text-lg normal-case outline-none placeholder:text-inactive",
              {
                "border-2 border-red-500": !isEmpty(
                  errors[FormFields.USERNAME],
                ),
              },
            )}
            {...register(FormFields.USERNAME, {
              required: "Đây là trường bắt buộc.",
              minLength: { value: 5, message: "Tối thiểu 5 ký tự." },
            })}
          />
          <FormError error={errors[FormFields.USERNAME]} />
        </FormControl>

        <FormControl>
          <label
            htmlFor={FormFields.PASSWORD}
            className="mx-0 mb-2 block font-semibold"
          >
            Mật khẩu
          </label>
          <div className="relative w-full">
            <input
              id={FormFields.PASSWORD}
              autoCapitalize="off"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className={classNames(
                "h-12 w-full rounded-lg bg-section pl-4 pr-3 text-lg outline-none placeholder:text-inactive",
                {
                  "border-2 border-red-500": !isEmpty(
                    errors[FormFields.PASSWORD],
                  ),
                },
              )}
              {...register(FormFields.PASSWORD, {
                required: "Đây là trường bắt buộc.",
                minLength: { value: 5, message: "Tối thiểu 5 ký tự." },
              })}
            />
            <Button
              variant="text"
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full !p-0"
              onClick={toggle}
            >
              {isPasswordVisible ? (
                <FaEyeSlash fontSize={18} />
              ) : (
                <FaEye fontSize={18} />
              )}
            </Button>
          </div>
          <FormError error={errors[FormFields.PASSWORD]} />
        </FormControl>

        <Button
          size="lg"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          Đăng nhập
        </Button>
      </div>
    </form>
  );
};

const LoginPage: React.FunctionComponent = () => {
  return (
    <Container
      maxW="md"
      flexGrow={1}
      display="flex"
      flexDir="column"
      bgColor="var(--zmp-background-white)"
    >
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
