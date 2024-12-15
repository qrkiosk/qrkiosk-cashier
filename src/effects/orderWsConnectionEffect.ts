import { storeIdAtom, tablesQueryAtom, tokenAtom } from "@/state";
import { atomEffect } from "jotai-effect";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

export default atomEffect((get) => {
  const token = get(tokenAtom);
  const storeId = get(storeIdAtom);
  const { refetch: refetchTables } = get(tablesQueryAtom);

  if (!token || !storeId) return;

  const socket = new SockJS(
    `https://ws.greendragonlog.com.vn/socket?token=${token}`,
  );
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);

    stompClient.subscribe(
      `/store/${storeId}/orders`,
      () => {
        refetchTables();
      },
      // (message: { body: string }) => {
      //   const wsOrder = JSON.parse(message.body) as Order;
      //   console.log(wsOrder);

      //   const tables = get.peek(localTablesAtom);
      //   const newTables = tables.map((table) =>
      //     table.id === wsOrder.tableId
      //       ? { ...table, orders: [...table.orders, wsOrder] }
      //       : table,
      //   );

      //   set(localTablesAtom, newTables);
      // },
    );

    const disconnectFromServer = () => {
      stompClient?.disconnect(() => {
        console.log("Disconnected.");
      });
    };

    return disconnectFromServer;
  });
});

/* old code
  const token = useAtomValue(tokenAtom);
  const storeId = useAtomValue(storeIdAtom);
  const addWsOrderToLocalTables = useSetAtom(addWsOrderToLocalTablesAtom);

  useEffect(() => {
    if (!token || !storeId) return;

    const socket = new SockJS(
      `https://ws.greendragonlog.com.vn/socket?token=${token}`
    );
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);

      stompClient.subscribe(
        `/store/${storeId}/orders`,
        (message: { body: string }) => {
          const newOrder = JSON.parse(message.body) as Order;
          console.log(newOrder);
          addWsOrderToLocalTables(newOrder);
        }
      );
    });

    return () => {
      stompClient?.disconnect(() => {
        console.log("Disconnected.");
      });
    };
  }, [token, storeId]);
*/
