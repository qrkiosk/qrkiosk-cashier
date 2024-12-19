import OrderItem from "@/components/order/order-item";
import ProductVariantEditor from "@/components/product/product-variant-editor";
import ProductVariantPicker from "@/components/product/product-variant-picker";
import { cartAtom } from "@/state/cart";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";

const Products = () => {
  const cart = useAtomValue(cartAtom);

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

      <ProductVariantPicker />
      <ProductVariantEditor />
    </>
  );
};

export default Products;
