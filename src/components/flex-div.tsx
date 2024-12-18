import classNames from "classnames";
import { HTMLProps } from "react";

const FlexDiv = ({
  children,
  col = false,
  row = true,
  center = false,
  className = "",
  ...other
}: HTMLProps<HTMLDivElement> & {
  col?: boolean;
  row?: boolean;
  center?: boolean;
}) => {
  return (
    <div
      {...other}
      className={classNames(className, "flex flex-1 overflow-y-auto p-3", {
        "items-center justify-center": center,
        "flex-col": col,
        "flex-row": !col && row,
      })}
    >
      {children}
    </div>
  );
};

export default FlexDiv;
