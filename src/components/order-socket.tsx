import { storeIdAtom, tablesQueryAtom, tokenAtom } from "@/state";
import { useAtomValue } from "jotai";
import debounce from "lodash/debounce";
import { useEffect, useMemo } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

const OrderSocket = () => {
  const token = useAtomValue(tokenAtom);
  const storeId = useAtomValue(storeIdAtom);
  const { refetch: refetchTables } = useAtomValue(tablesQueryAtom);

  const refetchTablesDebounced = useMemo(
    () => debounce(refetchTables, 1250),
    [refetchTables],
  );

  useEffect(() => {
    if (!token || !storeId) return;

    let stompClient;

    try {
      const socket = new SockJS(
        `https://ws.greendragonlog.com.vn/socket?token=${token}`,
      );
      stompClient = Stomp.over(socket);

      stompClient.connect({}, (frame) => {
        console.log("Connected: " + frame);
        stompClient.subscribe(`/store/${storeId}/orders`, () => {
          refetchTablesDebounced();
        });
      });
    } catch (err) {
      console.log("order-socket error:", err);
    }

    return () => {
      stompClient?.disconnect?.(() => {
        console.log("Disconnected.");
      });
    };
  }, [token, storeId]);

  return null;
};

export default OrderSocket;

// (message: { body: string }) => {
//   const wsOrder = JSON.parse(message.body) as Order;
//   const tables = get.peek(localTablesAtom);
//   const newTables = tables.map((table) =>
//     table.id === wsOrder.tableId
//       ? { ...table, orders: [...table.orders, wsOrder] }
//       : table,
//   );
//   set(localTablesAtom, newTables);
// };
