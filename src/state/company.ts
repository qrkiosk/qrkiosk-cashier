import { getLedgerBook } from "@/api/company";
import { LedgerAccount } from "@/types/company";
import { atomWithQuery } from "jotai-tanstack-query";
import { companyIdAtom, storeIdAtom, tokenAtom } from ".";

export const ledgerBookQueryAtom = atomWithQuery<
  LedgerAccount[],
  Error,
  LedgerAccount[],
  [string, string, number | null, number | null]
>((get) => ({
  initialData: [],
  retry: false,
  queryKey: [
    "ledgerBook",
    get(tokenAtom),
    get(storeIdAtom),
    get(companyIdAtom),
  ],
  queryFn: async ({ queryKey: [, token, storeId, companyId] }) => {
    if (!token || storeId == null || companyId == null) {
      return [];
    }

    const response = await getLedgerBook(
      {
        filtered: [
          { id: "companyId", value: companyId },
          { id: "storeId", value: storeId },
          { id: "name", value: "" },
        ],
        sorted: [{ id: "createdAt", asc: true }],
        pageSize: 1000,
        page: 0,
      },
      token,
    );

    return response.data.data.data;
  },
}));
