import { cartAtom, syncCartFromOrderEffect } from "@/state/cart";
import { useAtom, useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import OrderItem from "./order-item";

const Products = () => {
  useAtom(syncCartFromOrderEffect);
  const cart = useAtomValue(cartAtom);

  return (
    <div className="bg-[--zmp-background-white] px-4 py-3">
      <p className="font-semibold">Sản phẩm</p>

      {isEmpty(cart.items) ? (
        <p className="py-5 text-center text-sm text-subtitle">
          Giỏ hàng chưa có sản phẩm nào.
        </p>
      ) : (
        <div className="grid grid-cols-3">
          {cart.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
