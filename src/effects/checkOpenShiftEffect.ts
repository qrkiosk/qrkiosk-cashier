import { checkIsShiftOpen } from "@/api/company";
import {
  companyIdAtom,
  currentShiftAtom,
  hasOngoing401ErrorAtom,
  openShiftModalAtom,
  storeIdAtom,
  tokenAtom,
} from "@/state";
import { withErrorStatusCodeHandler } from "@/utils/error";
import { atomEffect } from "jotai-effect";

export default atomEffect((get, set) => {
  const token = get(tokenAtom);
  const companyId = get(companyIdAtom);
  const storeId = get(storeIdAtom);

  if (!token || !companyId || !storeId) return;

  const escalate401Error = () => {
    set(hasOngoing401ErrorAtom, true); // escalate error to Layout (eventually logs user out)
  };
  const fetchWith401Handler = withErrorStatusCodeHandler(checkIsShiftOpen, [
    { statusCode: 401, handler: escalate401Error },
  ]);

  fetchWith401Handler({ companyId, storeId }, token).then((res) => {
    const shift = res.data.data;
    console.log(shift);

    if (shift == null) {
      set(openShiftModalAtom, true);
    } else {
      set(currentShiftAtom, shift);
    }
  });
});