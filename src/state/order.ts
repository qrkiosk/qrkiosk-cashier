import { getOrders } from "@/api/order";
import { Order } from "@/types/order";
import { atomWithQuery } from "jotai-tanstack-query";
import { companyIdAtom, storeIdAtom, tokenAtom } from ".";

export const ordersQueryAtom = atomWithQuery<
  Order[],
  Error,
  Order[],
  [string, number | null, number | null, string]
>((get) => ({
  initialData: [],
  retry: false,
  queryKey: ["orders", get(companyIdAtom), get(storeIdAtom), get(tokenAtom)],
  queryFn: async ({ queryKey: [, companyId, storeId, token] }) => {
    if (!token || storeId == null || companyId == null) {
      return [];
    }

    const response = await getOrders(
      {
        filtered: [
          { id: "storeId", value: storeId },
          { id: "companyId", value: companyId },
          { id: "name", value: "" },
          { id: "fromDate", value: "2024-12-01T00:00:00.000Z" },
          { id: "toDate", value: "" },
          // { id: "status", valueList: [1, 2, 3] },
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
