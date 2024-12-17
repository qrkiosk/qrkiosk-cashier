import Divider from "@/components/section-divider";
import { OptionWithSelectedDetail } from "@/types/product";
import MandatoryOption from "./mandatory-option";
import NonMandatoryOption from "./non-mandatory-option";

const ProductOption = ({
  children: option,
}: {
  children: OptionWithSelectedDetail;
}) => {
  return (
    <>
      <div className="bg-white p-4">
        {option.isMandatory ? (
          <MandatoryOption option={option} />
        ) : (
          <NonMandatoryOption option={option} />
        )}
      </div>
      <Divider />
    </>
  );
};

export default ProductOption;
