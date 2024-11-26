import { useAtom } from "jotai";

import { orderWsConnectionEffect } from "../effects";

const OrderSocket = () => {
  useAtom(orderWsConnectionEffect);
  return null;
};

export default OrderSocket;
