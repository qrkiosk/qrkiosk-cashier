import Button from "@/components/button";
import { useProductVariantEditor } from "@/hooks";
import { removeCartItemAtom } from "@/state/cart";
import { CartItem, CartItemOption } from "@/types/cart";
import {
  calcItemTotalAmount,
  genMultiChoiceOptionDisplayText,
} from "@/utils/cart";
import { withThousandSeparators } from "@/utils/number";
import { useSetAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useCallback, useMemo } from "react";

const OrderItemOption = ({ option }: { option: CartItemOption }) => {
  if (option.selectedDetail) {
    return <p className="text-xs">{option.selectedDetail.name}</p>;
  }

  if (!isEmpty(option.selectedDetails)) {
    return <p className="text-xs">{genMultiChoiceOptionDisplayText(option)}</p>;
  }

  return null;
};

const OrderItem = ({
  item,
  readOnly = false,
}: {
  item: CartItem;
  readOnly?: boolean;
}) => {
  const { onOpen } = useProductVariantEditor();
  const removeCartItem = useSetAtom(removeCartItemAtom);
  const itemFormattedPrice = useMemo(
    () => withThousandSeparators(calcItemTotalAmount(item)),
    [item],
  );

  const onClickEditItem = useCallback(() => {
    if (!readOnly) onOpen(item.id, item);
  }, [item]);

  const onClickRemoveItem = useCallback(() => {
    if (!readOnly) removeCartItem(item.uniqIdentifier);
  }, [item.uniqIdentifier]);

  return (
    <>
      <div className="col-span-2 flex">
        <div className="clickable-area" onClick={onClickEditItem}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md border-[1px] border-primary">
            <span className="text-sm font-semibold text-primary">
              {item.quantity}x
            </span>
          </div>
        </div>
        <div className="flex-1 pl-2">
          <div className="clickable-area flex-1" onClick={onClickEditItem}>
            <p className="mb-1 text-sm font-semibold">{item.name}</p>
            <div className="space-y-1">
              {item.options.map((opt) => (
                <OrderItemOption key={opt.id} option={opt} />
              ))}
              {item.note && (
                <p className="text-xs text-subtitle">{item.note}</p>
              )}
            </div>
          </div>
          {!readOnly && (
            <div className="flex items-stretch space-x-3 pt-2">
              <Button
                size="xs"
                variant="text"
                className="text-primary"
                disabled={item.isDone}
                onClick={onClickEditItem}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="text"
                className="text-primary"
                disabled={item.isDone}
                onClick={onClickRemoveItem}
              >
                Xóa
              </Button>
              <div
                className="clickable-area flex-1"
                onClick={onClickEditItem}
              />
            </div>
          )}
        </div>
      </div>
      <div className="clickable-area col-span-1" onClick={onClickEditItem}>
        <p className="text-right text-sm font-semibold">{itemFormattedPrice}</p>
      </div>
    </>
  );
};

export default OrderItem;
