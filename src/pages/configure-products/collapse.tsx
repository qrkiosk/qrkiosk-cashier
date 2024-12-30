import { useRealHeight } from "@/hooks";
import { animated, useSpringValue } from "@react-spring/web";
import classNames from "classnames";
import { ReactNode, useEffect, useRef } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useBoolean } from "usehooks-ts";

type CollapseProps = {
  title: ReactNode;
  children: ReactNode;
};

export const Collapse = ({ title, children }: CollapseProps) => {
  const { value: collapsed, toggle: toggleCollapse } = useBoolean(true);
  const container = useRef<HTMLDivElement>(null);
  const containerHeight = useRealHeight(container);
  const height = useSpringValue(0);

  useEffect(() => {
    height.start(collapsed ? 0 : 1);
  }, [collapsed]);

  return (
    <div className="rounded-xl border-[1px] border-black/5 bg-white">
      <div
        className={classNames(
          "flex cursor-pointer items-center justify-between space-x-3 p-4",
          {
            "border-b-0": collapsed,
            "border-b-[1px] border-black/5": !collapsed,
          },
        )}
        onClick={toggleCollapse}
      >
        {title}
        {collapsed ? <FaAngleDown /> : <FaAngleUp />}
      </div>

      <animated.div
        className="overflow-hidden whitespace-pre-wrap ease-in-out"
        style={{
          maxHeight: height.to((x) => x * containerHeight),
        }}
      >
        <div ref={container}>{children}</div>
      </animated.div>
    </div>
  );
};
