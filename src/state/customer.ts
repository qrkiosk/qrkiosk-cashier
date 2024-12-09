import { getCustomers } from "@/api/customer";
import { Customer } from "@/types/customer";
import { atomWithQuery } from "jotai-tanstack-query";
import { companyIdAtom, storeIdAtom, tokenAtom } from ".";

export const customersQueryAtom = atomWithQuery<
  Customer[],
  Error,
  Customer[],
  [string, string, number | null, number | null]
>((get) => ({
  initialData: [],
  retry: false,
  queryKey: ["customers", get(tokenAtom), get(storeIdAtom), get(companyIdAtom)],
  queryFn: async ({ queryKey: [, token, storeId, companyId] }) => {
    if (!token || storeId == null || companyId == null) {
      return [];
    }

    const response = await getCustomers(
      {
        filtered: [
          { id: "companyId", value: companyId },
          { id: "storeId", value: storeId },
          { id: "name", value: "" },
        ],
        sorted: [{ id: "name", asc: true }],
        pageSize: 1000,
        page: 0,
      },
      token,
    );
    return response.data.data;
  },
}));
