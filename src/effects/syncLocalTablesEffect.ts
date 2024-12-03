import { atomEffect } from "jotai-effect";

import { localTablesAtom, tablesQueryAtom } from "../state";

export default atomEffect((get, set) => {
  const tables = get(tablesQueryAtom).data;
  set(localTablesAtom, tables);
});
