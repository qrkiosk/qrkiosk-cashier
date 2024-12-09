import { AxiosError } from "axios";
import { atom } from "jotai";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import { currentOrderQueryAtom, tablesQueryAtom } from ".";
import { customersQueryAtom } from "./customer";
import { productsQueryAtom, singleProductQueryAtom } from "./product";

export const hasOngoing401ErrorAtom = atom(false);

export const has401FromAnyQueryAtom = atom((get) => {
  const errors = compact([
    get(tablesQueryAtom).error,
    get(currentOrderQueryAtom).error,
    get(customersQueryAtom).error,
    get(productsQueryAtom).error,
    get(singleProductQueryAtom).error,
  ]) as AxiosError[];

  if (isEmpty(errors)) return false;

  return errors.some((error) => error.status === 401);
});

export const has401Atom = atom(
  (get) => get(hasOngoing401ErrorAtom) || get(has401FromAnyQueryAtom),
);
