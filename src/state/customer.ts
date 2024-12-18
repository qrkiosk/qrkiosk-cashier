import { getCustomers } from "@/api/customer";
import { Customer } from "@/types/customer";
import { searchCustomers } from "@/utils/search";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import isEmpty from "lodash/isEmpty";
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

export const searchCustomerQueryAtom = atom<string>("");

export const searchCustomerResultsAtom = atom((get) => {
  const searchQuery = get(searchCustomerQueryAtom);
  const customers = get(customersQueryAtom).data;

  if (isEmpty(searchQuery)) return customers;

  return searchCustomers(searchQuery, customers);
});

export const defaultCustomerAtom = atom((get) => {
  return get(customersQueryAtom).data.find((customer) => customer.isDefault);
});
