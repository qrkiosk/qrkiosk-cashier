import { setVariantSelectedDetailsAtom } from "@/state/product";
import { OptionWithSelectedDetail } from "@/types/product";
import {
  Checkbox,
  CheckboxGroup,
  Divider as LineDivider,
  Stack,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

const NonMandatoryOption = ({
  option,
}: {
  option: OptionWithSelectedDetail;
}) => {
  const setVariantSelectedDetails = useSetAtom(setVariantSelectedDetailsAtom);

  const selectedDetails = useMemo(
    () => option.selectedDetails.map((detail) => detail.id),
    [option.selectedDetails],
  );
  const setSelectedDetails = useCallback(
    (checkedDetailIds: string[]) => {
      setVariantSelectedDetails(option.id, checkedDetailIds);
    },
    [option.id],
  );

  return (
    <div>
      <p className="mb-4 text-base font-bold">{option.name}</p>
      <CheckboxGroup value={selectedDetails} onChange={setSelectedDetails}>
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
                    <Checkbox id={detail.id} value={detail.id} />
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
      </CheckboxGroup>
    </div>
  );
};

export default NonMandatoryOption;
