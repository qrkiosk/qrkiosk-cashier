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
      className={classNames(
        "flex max-w-screen-md flex-1 overflow-auto p-3",
        {
          "items-center justify-center": center,
          "flex-col": col,
          "flex-row": !col && row,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FlexDiv;
