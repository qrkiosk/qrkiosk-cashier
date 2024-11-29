import classNames from "classnames";
import { HTMLProps } from "react";
import { PlusIcon2 } from "./vectors";

const FloatingButton = ({
  className,
  ...otherProps
}: HTMLProps<HTMLButtonElement>) => {
  return (
    <button
      className={classNames(
        className,
        "fixed z-[999] flex h-12 w-12 items-center justify-center rounded-full bg-[--primary] text-white shadow-xl transition duration-300 active:scale-95",
      )}
      {...otherProps}
    >
      <PlusIcon2 />
    </button>
  );
};

export default FloatingButton;
