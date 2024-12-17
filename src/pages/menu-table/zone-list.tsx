import { allZonesAtom, currentZoneAtom } from "@/state";
import { ALL_ZONES } from "@/utils/constants";
import { useRadio, useRadioGroup } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";

const RadioCard = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <label>
      <input {...input} style={{ display: "none" }} />
      <div
        {...checkbox}
        className="cursor-pointer border-none px-3 py-1 shadow-none data-[checked]:rounded-md data-[checked]:bg-primary data-[checked]:text-white"
      >
        <span className="text-sm font-semibold sm:text-base">
          {props.children}
        </span>
      </div>
    </label>
  );
};

const ZoneList = () => {
  const zones = useAtomValue(allZonesAtom);
  const setCurrentZone = useSetAtom(currentZoneAtom);
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "zone",
    defaultValue: ALL_ZONES,
    onChange: setCurrentZone,
  });

  return (
    <div
      {...getRootProps()}
      className="scrollbar-hidden z-[998] flex min-h-12 items-center !gap-0 overflow-x-auto overflow-y-hidden whitespace-nowrap border-b-[1px] border-b-black/10 bg-white px-2"
    >
      {zones.map(({ value, text }) => (
        <RadioCard key={value} {...getRadioProps({ value })}>
          {text}
        </RadioCard>
      ))}
    </div>
  );
};

export default ZoneList;
