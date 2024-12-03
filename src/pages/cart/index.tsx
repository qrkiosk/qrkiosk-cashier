import HorizontalDivider from "@/components/horizontal-divider";
import { EmptyBoxIcon } from "@/components/vectors";
import { cartState } from "@/state";
import { useAtomValue } from "jotai";
import ApplyVoucher from "./apply-voucher";
import CartList from "./cart-list";
import CartSummary from "./cart-summary";
import SelectAll from "./select-all";

export default function CartPage() {
  const cart = useAtomValue(cartState);

  if (!cart.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-8">
        <EmptyBoxIcon />
        <div className="text-center text-2xs text-inactive">
          Không có sản phẩm trong giỏ hàng
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col">
      <SelectAll />
      <HorizontalDivider />
      <CartList />
      <HorizontalDivider />
      <ApplyVoucher />
      <HorizontalDivider />
      <CartSummary />
    </div>
  );
}
