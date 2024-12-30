import Button from "@/components/button";
import HorizontalDivider from "@/components/horizontal-divider";
import { MinusIcon, PlusIcon } from "@/components/vectors";
import { useRealHeight } from "@/hooks";
import { animated, useSpringValue } from "@react-spring/web";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";

export interface CollapseProps {
  items: {
    title: ReactNode;
    content: ReactNode;
  }[];
}

function CollapseItem(props: CollapseProps["items"][number]) {
  const [collapsed, setCollapsed] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const containerHeight = useRealHeight(container);
  const height = useSpringValue(0);

  useEffect(() => {
    height.start(collapsed ? 0 : 1);
  }, [collapsed]);

  return (
    <>
      <div className="relative flex cursor-pointer items-center space-x-3 py-2">
        <Button variant="text" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PlusIcon /> : <MinusIcon />}
        </Button>
        <div
          className="flex flex-1 justify-between"
          onClick={() => setCollapsed(!collapsed)}
        >
          {props.title}
        </div>

        <Button
          variant="text"
          className="absolute -right-10 top-1/2 -translate-y-1/2 text-subtitle"
          onClick={() => {}}
        >
          <FaAnglesRight />
        </Button>
      </div>
      <animated.div
        className="overflow-hidden whitespace-pre-wrap text-sm text-subtitle ease-in-out"
        style={{
          maxHeight: height.to((x) => x * containerHeight),
        }}
      >
        <div ref={container}>
          <div className="pb-3">{props.content}</div>
        </div>
      </animated.div>
    </>
  );
}

export default function Collapse(props: CollapseProps) {
  return (
    <div>
      {props.items.map((item, index) => (
        <Fragment key={index}>
          <CollapseItem key={index} {...item} />
          {index < props.items.length - 1 && <HorizontalDivider />}
        </Fragment>
      ))}
    </div>
  );
}
