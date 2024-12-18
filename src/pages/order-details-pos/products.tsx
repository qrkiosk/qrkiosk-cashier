import OrderItem from "@/components/order/order-item";
import ProductVariantEditor from "@/components/product/product-variant-editor";
import { currentOrderAtom } from "@/state";
import { cartAtom, isCartDirtyAtom } from "@/state/cart";
import { convertOrderToCart } from "@/utils/cart";
import { useAtom, useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";

const Products = () => {
  const order = useAtomValue(currentOrderAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const isCartDirty = useAtomValue(isCartDirtyAtom);

  useEffect(() => {
    if (!isCartDirty && order) {
      setCart({
        ...cart,
        ...convertOrderToCart(order),
      });
    }
  }, [order]);

  return (
    <>
      <div className="space-y-4 bg-white px-4 py-3">
        <p className="font-semibold">Sản phẩm</p>

        {isEmpty(cart.items) ? (
          <p className="py-5 text-center text-sm text-subtitle">
            Giỏ hàng chưa có sản phẩm nào.
          </p>
        ) : (
          <div className="grid-g grid grid-cols-3 gap-y-4">
            {cart.items.reduce((acc, item) => {
              if (item.isActive) {
                return [
                  ...acc,
                  <OrderItem key={item.uniqIdentifier} item={item} />,
                ];
              }
              return acc;
            }, [])}
          </div>
        )}
      </div>
      <ProductVariantEditor />
    </>
  );
};

export default Products;
