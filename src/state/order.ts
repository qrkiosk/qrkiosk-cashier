import { getOrders } from "@/api/order";
import { Shift, ShiftStatus } from "@/types/company";
import { Order } from "@/types/order";
import { atomWithQuery } from "jotai-tanstack-query";
import { companyIdAtom, currentShiftAtom, storeIdAtom, tokenAtom } from ".";

export const ordersQueryAtom = atomWithQuery<
  Order[],
  Error,
  Order[],
  [string, string, number | null, number | null, Shift | null]
>((get) => ({
  initialData: [],
  retry: false,
  queryKey: [
    "orders",
    get(tokenAtom),
    get(storeIdAtom),
    get(companyIdAtom),
    get(currentShiftAtom),
  ],
  queryFn: async ({
    queryKey: [, token, storeId, companyId, currentShift],
  }) => {
    if (
      !token ||
      storeId == null ||
      companyId == null ||
      currentShift == null
    ) {
      return [];
    }

    const { status, beginDate, endDate } = currentShift;

    if (status == null) return [];

    const isShiftOpen = status === ShiftStatus.OPEN;
    const isShiftClosed = status === ShiftStatus.CLOSE;

    if ((isShiftOpen && !beginDate) || (isShiftClosed && !endDate)) return [];

    const fromDate = isShiftClosed ? endDate : beginDate;
    const response = await getOrders(
      {
        filtered: [
          { id: "companyId", value: companyId },
          { id: "storeId", value: storeId },
          { id: "fromDate", value: fromDate },
          { id: "toDate", value: "" },
          { id: "name", value: "" },
        ],
        sorted: [{ id: "createdAt", asc: true }],
        pageSize: 100,
        page: 0,
      },
      token,
    );
    return response.data.data;
  },
}));
