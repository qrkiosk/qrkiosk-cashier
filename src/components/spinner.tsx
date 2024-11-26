import spinnerSVG from "@/static/spinner.svg";
import { Spinner as ZSpinner } from "zmp-ui";

const Spinner = () => {
  return (
    <ZSpinner logo={<img className="h-[32px] w-[32px]" src={spinnerSVG} />} />
  );
};

export default Spinner;
