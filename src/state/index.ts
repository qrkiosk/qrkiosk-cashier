import { getTables } from "@/api/company";
import { getOrder } from "@/api/order";
import { Cart, Category, Color, Product } from "@/types.global";
import { Tab } from "@/types/common";
import { Shift, ShiftStatus, Table, TableType } from "@/types/company";
import { Order, OrderReqBody, OrderStatus } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { AuthResult } from "@/types/user";
import { ALL_ZONES } from "@/utils/constants";
import { requestWithFallback } from "@/utils/request";
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomFamily, atomWithStorage, RESET, unwrap } from "jotai/utils";
import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";
import { getUserInfo } from "zmp-sdk";

export const userState = atom(() =>
  getUserInfo({
    avatarType: "normal",
  }),
);

export const bannersState = atom(() =>
  requestWithFallback<string[]>("/banners", []),
);

export const tabsState = atom(["Tất cả", "Nam", "Nữ", "Trẻ em"]);

export const selectedTabIndexState = atom(0);

export const categoriesState = atom(() =>
  requestWithFallback<Category[]>("/categories", []),
);

export const categoriesStateUpwrapped = unwrap(
  categoriesState,
  (prev) => prev ?? [],
);

export const productsState = atom(async (get) => {
  const categories = await get(categoriesState);
  const products = await requestWithFallback<
    (Product & { categoryId: number })[]
  >("/products", []);
  return products.map((product) => ({
    ...product,
    category: categories.find(
      (category) => category.id === product.categoryId,
    )!,
  }));
});

export const flashSaleProductsState = atom((get) => get(productsState));

export const recommendedProductsState = atom((get) => get(productsState));

export const sizesState = atom(["S", "M", "L", "XL"]);

export const selectedSizeState = atom<string | undefined>(undefined);

export const colorsState = atom<Color[]>([
  {
    name: "Đỏ",
    hex: "#FFC7C7",
  },
  {
    name: "Xanh dương",
    hex: "#DBEBFF",
  },
  {
    name: "Xanh lá",
    hex: "#D1F0DB",
  },
  {
    name: "Xám",
    hex: "#D9E2ED",
  },
]);

export const selectedColorState = atom<Color | undefined>(undefined);

export const productState = atomFamily((id: number) =>
  atom(async (get) => {
    const products = await get(productsState);
    return products.find((product) => product.id === id);
  }),
);

export const cartState = atom<Cart>([]);

export const selectedCartItemIdsState = atom<number[]>([]);

export const checkoutItemsState = atom((get) => {
  const ids = get(selectedCartItemIdsState);
  const cart = get(cartState);
  return cart.filter((item) => ids.includes(item.id));
});

export const cartTotalState = atom((get) => {
  const items = get(checkoutItemsState);
  return {
    totalItems: items.length,
    totalAmount: items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ),
  };
});

export const keywordState = atom("");

export const searchResultState = atom(async (get) => {
  const keyword = get(keywordState);
  const products = await get(productsState);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return products.filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase()),
  );
});

/* ===== */

export const authResultAtom = atomWithStorage<AuthResult | null>(
  "cachedAuthResult",
  null,
  undefined,
  { getOnInit: true },
);

export const isAuthenticatedAtom = atom((get) => !!get(authResultAtom));
export const tokenAtom = atom((get) => get(authResultAtom)?.token || "");
export const userAtom = atom((get) => get(authResultAtom)?.user ?? null);
export const storeIdAtom = atom((get) => get(userAtom)?.storeId ?? null);
export const companyIdAtom = atom((get) => get(userAtom)?.companyId ?? null);

export const logoutAtom = atom(null, (_, set) => {
  set(authResultAtom, RESET);
});

export const currentShiftAtom = atom<Shift | null>(null);

export const activeTabAtom = atom<Tab>(Tab.TABLE);

export const currentZoneAtom = atom<string>(ALL_ZONES);

export const openShiftModalAtom = atom(false);

export const tablesQueryAtom = atomWithQuery<
  Table[],
  Error,
  Table[],
  [string, string, number | null, number | null, Shift | null]
>((get) => ({
  initialData: [],
  retry: false,
  queryKey: [
    "tables",
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
    const response = await getTables(
      {
        filtered: [
          { id: "companyId", value: companyId },
          { id: "storeId", value: storeId },
          { id: "fromDate", value: fromDate },
          { id: "toDate", value: "" },
          { id: "status", valueList: [OrderStatus.WAIT, OrderStatus.PROCESS] },
          { id: "name", value: "" },
        ],
        sorted: [{ id: "createdAt", asc: true }],
        pageSize: 100,
        page: 0,
      },
      token,
    );

    return response.data.data.data;
  },
}));

export const localTablesAtom = atom<Table[]>([]); // table list for optimistic update and real-time websocket updates

export const syncLocalTablesEffect = atomEffect((get, set) => {
  const tables = get(tablesQueryAtom).data;
  set(localTablesAtom, tables);
});

export const addWsOrderToLocalTablesAtom = atom(
  null,
  (get, set, wsOrder: Order) => {
    const tables = get(localTablesAtom);
    const newTables = tables.map((table) =>
      table.id === wsOrder.tableId
        ? { ...table, orders: [...table.orders, wsOrder] }
        : table,
    );

    set(localTablesAtom, newTables);
  },
);

export const emptyTablesAtom = atom((get) =>
  get(localTablesAtom).filter((item) => {
    const isOnSiteTable = item.type === TableType.ON_SITE;
    const noOrders = isEmpty(item.orders);

    return isOnSiteTable && noOrders;
  }),
);
export const inUseTablesAtom = atom((get) =>
  get(localTablesAtom).filter((item) => {
    const isOnSiteTable = item.type === TableType.ON_SITE;
    const hasOrder = !isEmpty(item.orders);

    return isOnSiteTable && hasOrder;
  }),
);
export const waitingTablesAtom = atom((get) =>
  get(localTablesAtom).filter((item) => {
    const isOnSiteTable = item.type === TableType.ON_SITE;
    const hasOrder = !isEmpty(item.orders);
    const allOrdersInProcess = item.orders.some(
      (order) => order.status === OrderStatus.WAIT,
    );

    return isOnSiteTable && hasOrder && allOrdersInProcess;
  }),
);

export const zonedTablesAtom = atom((get) => {
  const currentZone = get(currentZoneAtom);
  const all = get(localTablesAtom);

  if (currentZone === ALL_ZONES) return all;

  return all.filter((item) => item.zoneId === parseInt(currentZone));
});

export const zonedEmptyTablesAtom = atom((get) => {
  const currentZone = get(currentZoneAtom);
  const all = get(emptyTablesAtom);

  if (currentZone === ALL_ZONES) return all;

  return all.filter((item) => item.zoneId === parseInt(currentZone));
});

export const zonedInUseTablesAtom = atom((get) => {
  const currentZone = get(currentZoneAtom);
  const all = get(inUseTablesAtom);

  if (currentZone === ALL_ZONES) return all;

  return all.filter((item) => item.zoneId === parseInt(currentZone));
});

export const zonedWaitingTablesAtom = atom((get) => {
  const currentZone = get(currentZoneAtom);
  const all = get(waitingTablesAtom);

  if (currentZone === ALL_ZONES) return all;

  return all.filter((item) => item.zoneId === parseInt(currentZone));
});

export const allZonesAtom = atom((get) => {
  const zones = get(localTablesAtom).reduce<
    Array<{ value: string; text: string }>
  >(
    (acc, { zoneId, zoneName }) => {
      if (!zoneId || !zoneName) return acc;
      return [...acc, { value: zoneId.toString(), text: zoneName }];
    },
    [{ value: ALL_ZONES, text: "Tất cả khu vực" }],
  );

  return uniqBy(zones, "value");
});

export const currentMenuTableTabIndexAtom = atom(0);

export const currentOrderIdAtom = atom<string | null>(null);

export const currentOrderQueryAtom = atomWithQuery<
  Order | null,
  Error,
  Order | null,
  [string, string | null]
>((get) => ({
  staleTime: 0,
  queryKey: ["currentOrderDetails", get(currentOrderIdAtom)],
  queryFn: async ({ queryKey: [, orderId] }) => {
    if (!orderId) return null;

    const response = await getOrder(orderId);
    return response.data.data;
  },
}));

export const currentOrderAtom = atom<Order | null>(
  (get) => get(currentOrderQueryAtom).data ?? null,
);

export const currentTableAtom = atom<Table | null>(null);

export const draftOrderAtom = atom<Partial<OrderReqBody>>({});

export const isOrderWaitingAtom = atom(
  (get) => get(currentOrderAtom)?.status === OrderStatus.WAIT,
);

export const isOrderPaidAtom = atom(
  (get) => get(currentOrderAtom)?.paymentStatus === PaymentStatus.PAID,
);
