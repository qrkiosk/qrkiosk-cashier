import Checkbox from "@/components/checkbox";
import QuantityInput from "@/components/quantity-input";
import { RemoveIcon } from "@/components/vectors";
// import { useAddToCart } from "@/hooks";
import { selectedCartItemIdsState } from "@/state";
import { CartItem as CartItemProps } from "@/types.global";
import { formatPrice } from "@/utils/format";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

const SWIPE_TO_DELTE_OFFSET = 80;

export default function CartItem(props: CartItemProps) {
  const [quantity, setQuantity] = useState(props.quantity);
  // const { addToCart } = useAddToCart(props.product, props.id);

  const [selectedItemIds, setSelectedItemIds] = useAtom(
    selectedCartItemIdsState,
  );

  const displayOptions = useMemo(
    () =>
      Object.entries({
        Size: props.options.size,
        Color: props.options.color,
      })
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | "),
    [props.options],
  );

  // update cart
  useEffect(() => {
    // addToCart(quantity);
  }, [quantity]);

  // swipe left to delete animation
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(
    ({ last, offset: [ox] }) => {
      if (last) {
        if (ox < -SWIPE_TO_DELTE_OFFSET) {
          api.start({ x: -SWIPE_TO_DELTE_OFFSET });
        } else {
          api.start({ x: 0 });
        }
      } else {
        api.start({ x: Math.min(ox, 0), immediate: true });
      }
    },
    {
      from: () => [x.get(), 0],
      axis: "x",
      bounds: { left: -100, right: 0, top: 0, bottom: 0 },
      rubberband: true,
      preventScroll: true,
    },
  );

  return (
    <div className="relative">
      <div className="absolute bottom-0 right-0 top-0 w-20 border-y-[1px] border-black/10">
        <div
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-1 bg-danger text-white/95"
          onClick={() => {}}
        >
          <RemoveIcon />
          <div className="text-2xs font-medium">Xoá</div>
        </div>
      </div>

      <animated.div
        {...bind()}
        style={{ x }}
        className="relative flex items-center space-x-4 bg-white pl-4"
      >
        <Checkbox
          checked={selectedItemIds.includes(props.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedItemIds([...selectedItemIds, props.id]);
            } else {
              setSelectedItemIds(
                selectedItemIds.filter((id) => id !== props.id),
              );
            }
          }}
        />
        <img src={props.product.image} className="h-14 w-14 rounded-lg" />
        <div className="flex-1 border-b-[0.5px] border-black/10 py-4 pr-4">
          <div className="text-sm">{props.product.name}</div>
          {displayOptions && (
            <div className="mt-0.5 text-xs text-subtitle">{displayOptions}</div>
          )}
          <div className="flex items-center space-x-2 py-2">
            <div className="flex flex-1 flex-wrap items-center space-x-0.5">
              <div className="text-xs font-medium text-primary">
                {formatPrice(props.product.price)}
              </div>
              {props.product.originalPrice && (
                <div className="text-3xs text-subtitle line-through">
                  {formatPrice(props.product.originalPrice)}
                </div>
              )}
            </div>
            <QuantityInput
              value={quantity}
              onChange={(value) => {
                if (value <= 0) {
                  setQuantity(1);
                  api.start({ x: -SWIPE_TO_DELTE_OFFSET });
                } else {
                  setQuantity(value);
                  if (value > quantity) {
                    api.start({ x: 0 });
                  }
                }
              }}
            />
          </div>
        </div>
      </animated.div>
    </div>
  );
}
