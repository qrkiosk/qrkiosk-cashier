import Button from "@/components/button";
import { CustomerSupportIcon } from "@/components/vectors";
import { useCheckout, useCustomerSupport } from "@/hooks";
import { cartTotalState } from "@/state";
import { formatPrice } from "@/utils/format";
import { useAtomValue } from "jotai";

export default function CartSummary() {
  const { totalItems, totalAmount } = useAtomValue(cartTotalState);
  const contact = useCustomerSupport();
  const checkout = useCheckout();

  return (
    <div className="flex flex-none items-center space-x-2 px-4 py-3">
      <div className="flex-1 space-y-1">
        <div className="text-2xs text-subtitle">Tổng cộng ({totalItems})</div>
        <div className="text-sm font-medium text-primary">
          {formatPrice(totalAmount)}
        </div>
      </div>
      <Button variant="secondary" className="h-10 w-10 !p-2" onClick={contact}>
        <CustomerSupportIcon />
      </Button>
      <Button variant="primary" onClick={checkout} disabled={totalItems === 0}>
        Mua ngay
      </Button>
    </div>
  );
}
