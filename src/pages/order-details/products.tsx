import FloatingButton from "@/components/floating-button";
import OrderItem from "@/components/order/order-item";
import ProductVariantEditor from "@/components/product/product-variant-editor";
import { currentOrderAtom } from "@/state";
import { cartAtom, isCartDirtyAtom } from "@/state/cart";
import { BreadcrumbEntry } from "@/types/common";
import { convertOrderToCart } from "@/utils/cart";
import { useAtom, useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
  const order = useAtomValue(currentOrderAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [isCartDirty, setIsCartDirty] = useAtom(isCartDirtyAtom);

  useEffect(() => {
    if (!isCartDirty && order) {
      setIsCartDirty(false);
      setCart(convertOrderToCart(order));
    }
  }, [order]);

  return (
    <>
      <div className="space-y-4 bg-[--zmp-background-white] px-4 py-3">
        <p className="font-semibold">Sản phẩm</p>

        {isEmpty(cart.items) ? (
          <p className="py-5 text-center text-sm text-subtitle">
            Giỏ hàng chưa có sản phẩm nào.
          </p>
        ) : (
          <div className="grid-g grid grid-cols-3 gap-y-4">
            {cart.items.map((item) => (
              <OrderItem key={item.uniqIdentifier} item={item} />
            ))}
          </div>
        )}
      </div>

      <FloatingButton
        className="bottom-[100px] right-5 bg-gray-700 hover:bg-gray-800"
        onClick={() => {
          navigate("/pick-order-products", {
            state: {
              title: [...breadcrumb, { text: "Thêm món" }],
            },
          });
        }}
      />
      <ProductVariantEditor />
    </>
  );
};

export default Products;
