import { setVariantSelectedDetailAtom } from "@/state/product";
import { OptionWithSelectedDetail } from "@/types/product";
import {
  Divider as LineDivider,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useCallback } from "react";

const MandatoryOption = ({ option }: { option: OptionWithSelectedDetail }) => {
  const setVariantSelectedDetail = useSetAtom(setVariantSelectedDetailAtom);

  const setSelectedDetail = useCallback(
    (checkedDetailId: string) => {
      setVariantSelectedDetail(option.id, checkedDetailId);
    },
    [option.id],
  );

  return (
    <div>
      <p className="mb-4 text-base font-bold">{option.name}</p>
      <RadioGroup
        value={option.selectedDetail?.id}
        onChange={setSelectedDetail}
      >
        <Stack rowGap={3}>
          {option.details.map((detail, idx) => {
            const isLast = idx === option.details.length - 1;

            return (
              <div key={detail.id}>
                <label
                  htmlFor={detail.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex">
                    <Radio id={detail.id} value={detail.id} />
                    <span className="ml-3 text-sm">{detail.name}</span>
                  </div>
                  {detail.price > 0 && (
                    <span className="text-sm">+{detail.price}</span>
                  )}
                </label>
                {!isLast && <LineDivider mt={3} />}
              </div>
            );
          })}
        </Stack>
      </RadioGroup>
    </div>
  );
};

export default MandatoryOption;
