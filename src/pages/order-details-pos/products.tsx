import OrderItem from "@/components/order/order-item";
import ProductVariantEditor from "@/components/product/product-variant-editor";
import ProductVariantPicker from "@/components/product/product-variant-picker";
import { currentOrderAtom } from "@/state";
import {
  cartAtom,
  displayCartItemsAtom,
  isCartDirtyAtom,
  isCartEmptyAtom,
} from "@/state/cart";
import { convertOrderToCart } from "@/utils/cart";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

const Products = () => {
  const order = useAtomValue(currentOrderAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const isCartDirty = useAtomValue(isCartDirtyAtom);
  const isCartEmpty = useAtomValue(isCartEmptyAtom);
  const displayCartItems = useAtomValue(displayCartItemsAtom);

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

        {isCartEmpty ? (
          <p className="py-5 text-center text-sm text-subtitle">
            Giỏ hàng chưa có sản phẩm nào.
          </p>
        ) : (
          <div className="grid-g grid grid-cols-3 gap-y-4">
            {displayCartItems.map((item) => (
              <OrderItem key={item.uniqIdentifier} item={item} />
            ))}
          </div>
        )}
      </div>

      <ProductVariantPicker />
      <ProductVariantEditor />
    </>
  );
};

export default Products;
