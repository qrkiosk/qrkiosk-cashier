import FloatingButton from "@/components/floating-button";
import OrderItem from "@/components/order/order-item";
import ProductVariantEditor from "@/components/product/product-variant-editor";
import { currentOrderAtom } from "@/state";
import {
  cartAtom,
  displayCartItemsAtom,
  isCartDirtyAtom,
  isCartEmptyAtom,
} from "@/state/cart";
import { BreadcrumbEntry } from "@/types/common";
import { convertOrderToCart } from "@/utils/cart";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
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

      <FloatingButton
        className="bottom-[115px] right-4 bg-gray-700 hover:bg-gray-800"
        onClick={() => {
          navigate("/pick-order-products", {
            state: {
              title: [...breadcrumb, { text: "Thêm món" }],
              isCreatingOrder: false,
            },
          });
        }}
      />
      <ProductVariantEditor />
    </>
  );
};

export default Products;
