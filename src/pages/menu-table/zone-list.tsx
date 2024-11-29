import { allZonesAtom, currentZoneAtom } from "@/state";
import { ALL_ZONES } from "@/utils/constants";
import { Box, HStack, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";

const RadioCard = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} style={{ display: "none" }} />
      <Box
        {...checkbox}
        cursor="pointer"
        border="none"
        boxShadow="none"
        px={3}
        py={1}
        _checked={{
          borderRadius: "md",
          bg: "var(--primary)",
          color: "white",
        }}
      >
        <span className="text-sm font-semibold sm:text-base">
          {props.children}
        </span>
      </Box>
    </Box>
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
    <HStack
      {...getRootProps()}
      overflowX="auto"
      overflowY="hidden"
      whiteSpace="nowrap"
      minH="48px"
      bgColor="var(--zmp-background-white)"
      boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
      zIndex={998}
      gap={0}
      px={2}
      className="scrollbar-hidden"
    >
      {zones.map(({ value, text }) => (
        <RadioCard key={value} {...getRadioProps({ value })}>
          {text}
        </RadioCard>
      ))}
    </HStack>
  );
};

export default ZoneList;
