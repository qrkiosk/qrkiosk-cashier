import Divider from "@/components/section-divider";
import { OptionWithSelectedDetail } from "@/types/product";
import { Box } from "@chakra-ui/react";
import MandatoryOption from "./mandatory-option";
import NonMandatoryOption from "./non-mandatory-option";

const ProductOption = ({
  children: option,
}: {
  children: OptionWithSelectedDetail;
}) => {
  return (
    <>
      <Box p={4} bgColor="var(--zmp-background-white)">
        {option.isMandatory ? (
          <MandatoryOption option={option} />
        ) : (
          <NonMandatoryOption option={option} />
        )}
      </Box>
      <Divider />
    </>
  );
};

export default ProductOption;
