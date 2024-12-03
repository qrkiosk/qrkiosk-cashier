import classNames from "classnames";
import { HTMLProps } from "react";

const FormControl = ({
  children,
  className = "",
}: HTMLProps<HTMLDivElement>) => {
  return (
    <div className={classNames(className, "form-control relative")}>
      {children}
    </div>
  );
};

export default FormControl;
