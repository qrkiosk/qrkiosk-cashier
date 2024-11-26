import { ReactNode } from "react";

export interface TabsProps<T> {
  items: T[];
  value: T;
  onChange: (item: T) => void;
  renderLabel: (item: T) => ReactNode;
}

export default function Tabs<T>(props: TabsProps<T>) {
  return (
    <div
      className="grid h-11 bg-white border-b-[0.5px] border-black/10"
      style={{
        gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))`,
      }}
    >
      {props.items.map((item, i) => (
        <div
          key={i}
          className="h-full flex flex-col cursor-pointer"
          onClick={() => props.onChange(item)}
        >
          <div className="flex-1 flex items-center justify-center">
            <span
              className={"truncate text-sm font-medium ".concat(
                item === props.value ? "" : "text-inactive"
              )}
            >
              {props.renderLabel(item)}
            </span>
          </div>
          {props.value === item && (
            <div className="bg-tabIndicator h-[2px] rounded-t-sm -mt-px" />
          )}
        </div>
      ))}
    </div>
  );
}
