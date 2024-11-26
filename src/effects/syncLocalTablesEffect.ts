import { atomEffect } from "jotai-effect";

import { localTablesAtom, tablesAtom } from "../state";

export default atomEffect((get, set) => {
  const tables = get(tablesAtom).data;
  set(localTablesAtom, tables);
});
