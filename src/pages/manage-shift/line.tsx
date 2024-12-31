import classNames from "classnames";
import { ReactNode } from "react";

const Line = ({
  left,
  mid,
  right,
  leftIndent = false,
}: {
  left: ReactNode;
  mid: ReactNode;
  right?: ReactNode;
  leftIndent?: boolean;
}) => {
  return (
    <>
      <div
        className={classNames("col-span-3 flex items-center", {
          "pl-2": leftIndent,
        })}
      >
        {left}
      </div>
      <div className="col-span-3 flex items-center justify-end">{mid}</div>
      {right && <div className="col-span-1 flex items-center">{right}</div>}
    </>
  );
};

export default Line;
