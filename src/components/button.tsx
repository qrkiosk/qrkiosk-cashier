import classNames from "classnames";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const getVariantStyle = (variant: ButtonVariant) => {
  switch (variant) {
    case "secondary":
      return "bg-secondary";
    case "text":
      return "bg-none !p-0";
    case "primary":
    default:
      return "bg-primary text-white";
  }
};

const getSizeStyle = (size: ButtonSize) => {
  switch (size) {
    case "xs":
      return "px-2.5 py-[4px] text-xs";
    case "sm":
      return "px-3 py-[7px]";
    case "lg":
      return "px-6 py-3.5";
    case "md":
    default:
      return "px-6 py-2.5";
  }
};

const Button = ({
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={classNames(
        className,
        `rounded-lg text-base font-medium disabled:opacity-50 ${getVariantStyle(variant)} ${getSizeStyle(size)}`,
      )}
      {...props}
    />
  );
};

export default Button;
