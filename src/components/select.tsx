import { ReactNode, useState } from "react";
import { Picker } from "zmp-ui";
import { ChevronDown } from "./vectors";

export interface SelectProps<T> {
  renderTitle: (selectedItem?: T) => ReactNode;
  renderItemKey: (item: T) => string;
  renderItemLabel?: (item: T) => string;
  items: T[];
  value?: T;
  onChange: (selectedItem?: T) => void;
}

export default function Select<T>(props: SelectProps<T>) {
  const [localValue, setLocalValue] = useState(
    props.value ? props.renderItemKey(props.value) : "",
  );

  const flush = () => {
    const selectedItem = props.items.find(
      (item) => props.renderItemKey(item) === localValue,
    );
    props.onChange(selectedItem);
  };

  return (
    <div className="relative h-8 flex-none rounded-full border border-black/15 [&>.zaui-picker-input]:absolute [&>.zaui-picker-input]:inset-0 [&>.zaui-picker-input]:opacity-0">
      <Picker
        mask
        maskClosable
        title={props.renderTitle() as unknown as string}
        data={[
          {
            name: "localValue",
            options: props.items.map((item) => ({
              displayName:
                props.renderItemLabel?.(item) ?? props.renderItemKey(item),
              key: props.renderItemKey(item),
              value: props.renderItemKey(item),
            })),
          },
        ]}
        value={{
          localValue,
        }}
        onChange={({ localValue }) => {
          setLocalValue(localValue.key ?? "");
        }}
        action={{
          text: "OK",
          close: true,
          onClick: () => {
            flush();
          },
        }}
      />
      <div className="pointer-events-none relative flex h-full items-center justify-center space-x-1.5 px-3">
        <div className="text-xs">
          {props.renderTitle
            ? props.renderTitle(props.value)
            : String(props.value)}
        </div>
        <ChevronDown />
      </div>
    </div>
  );
}
