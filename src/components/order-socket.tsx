import { checkIsShiftOpen } from "@/api/company";
import {
  companyIdAtom,
  storeIdAtom,
  tablesQueryAtom,
  tokenAtom,
} from "@/state";
import { useAtomValue } from "jotai";
import debounce from "lodash/debounce";
import { useEffect, useMemo } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

const connect = ({
  token,
  storeId,
  handler,
}: {
  token: string;
  storeId: number;
  handler: () => void;
}) => {
  const socket = new SockJS(
    `https://ws.greendragonlog.com.vn/socket?token=${token}`,
  );
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);
    stompClient.subscribe(`/store/${storeId}/orders`, handler);
  });
};

const OrderSocket = () => {
  const token = useAtomValue(tokenAtom);
  const storeId = useAtomValue(storeIdAtom);
  const companyId = useAtomValue(companyIdAtom);

  const { refetch: refetchTables } = useAtomValue(tablesQueryAtom);
  const refetchTablesDebounced = useMemo(
    () => debounce(refetchTables, 1250),
    [refetchTables],
  );

  const attemptConnect = async () => {
    if (!token || !storeId || !companyId) return;

    try {
      await checkIsShiftOpen({ companyId, storeId }, token);
      connect({
        token,
        storeId,
        handler: () => {
          refetchTablesDebounced();
        },
      });
    } catch (err) {
      console.log("order-socket error:", err);
    }
  };

  useEffect(() => {
    if (token) attemptConnect();
  }, [token]);

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
