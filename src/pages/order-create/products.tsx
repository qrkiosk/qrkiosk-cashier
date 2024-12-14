import FloatingButton from "@/components/floating-button";
import OrderItem from "@/components/order/order-item";
import ProductVariantEditor from "@/components/product/product-variant-editor";
import { cartAtom, INITIAL_CART_STATE, isCartDirtyAtom } from "@/state/cart";
import { BreadcrumbEntry } from "@/types/common";
import { useAtom, useSetAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
  const [cart, setCart] = useAtom(cartAtom);
  const setIsCartDirty = useSetAtom(isCartDirtyAtom);

  const navigateToProductPicker = () => {
    navigate("/pick-order-products", {
      state: {
        title: [...breadcrumb, { text: "Thêm món" }],
      },
    });
  };

  useEffect(() => {
    setIsCartDirty(false);
    setCart(INITIAL_CART_STATE);
    navigateToProductPicker();
  }, []);

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

      <FloatingButton
        className="bottom-[115px] right-4 bg-gray-700 hover:bg-gray-800"
        onClick={navigateToProductPicker}
      />
      <ProductVariantEditor />
    </>
  );
};

export default Products;
