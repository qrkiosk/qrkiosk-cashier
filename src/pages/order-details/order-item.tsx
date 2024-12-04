import Button from "@/components/button";
import { Price } from "@/components/prices";
import { CartItem, CartItemOption } from "@/types/cart";
import {
  calcItemTotalAmount,
  genMultiChoiceOptionDisplayText,
} from "@/utils/cart";
import isEmpty from "lodash/isEmpty";
import { useCallback } from "react";
// import {
//   isEditingCartItemAtom,
//   productVariantAtom,
//   removeCartItemAtom,
// } from "@/state";

const OrderItemOption = ({ option }: { option: CartItemOption }) => {
  if (option.selectedDetail) {
    return <p className="text-xs">{option.selectedDetail.name}</p>;
  }

  if (!isEmpty(option.selectedDetails)) {
    return <p className="text-xs">{genMultiChoiceOptionDisplayText(option)}</p>;
  }

  return null;
};

const OrderItem = ({ item }: { item: CartItem }) => {
  // const removeCartItem = useSetAtom(removeCartItemAtom);
  // const setProductVariant = useSetAtom(productVariantAtom);
  // const setIsEditingCartItem = useSetAtom(isEditingCartItemAtom);

  const onClickEditItem = useCallback(() => {
    // setProductVariant(item);
    // setIsEditingCartItem(true);
  }, [item]);

  const onClickRemoveItem = useCallback(() => {
    // removeCartItem(item.uniqIdentifier);
  }, [item.uniqIdentifier]);

  return (
    <>
      <div className="col-span-2">
        <div className="mt-5 flex h-full w-full">
          <div className="clickable-area" onClick={onClickEditItem}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md border-[1px] border-primary">
              <span className="text-sm font-semibold text-primary">
                {item.quantity}x
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div
              className="clickable-area ml-2 flex-1"
              onClick={onClickEditItem}
            >
              <p className="mb-1 text-xs font-semibold">{item.name}</p>
              <div className="space-y-1">
                {item.options.map((opt) => (
                  <OrderItemOption key={opt.id} option={opt} />
                ))}
                {item.note && (
                  <p className="text-xs text-subtitle">{item.note}</p>
                )}
              </div>
            </div>
            <div className="ml-2 mt-2 flex items-stretch space-x-3">
              <Button
                size="xs"
                variant="text"
                className="text-primary"
                onClick={onClickEditItem}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="text"
                className="text-primary"
                onClick={onClickRemoveItem}
              >
                Xóa
              </Button>
              <div
                className="clickable-area flex-1"
                onClick={onClickEditItem}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="clickable-area col-span-1" onClick={onClickEditItem}>
        <Price variant="standard" textAlign="right" mt={5}>
          {calcItemTotalAmount(item)}
        </Price>
      </div>
    </>
  );
};

export default OrderItem;
