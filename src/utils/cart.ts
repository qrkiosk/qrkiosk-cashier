import { Product, SelectedOptions } from "@/types.global";
import { CartItem, CartItemOption } from "@/types/cart";

export function getDefaultOptions(product: Product): SelectedOptions {
  return {
    size: product.sizes?.[0],
    color: product.colors?.[0].name,
  };
}

export function isIdentical(
  option1: SelectedOptions,
  option2: SelectedOptions,
) {
  return option1.size === option2.size && option1.color === option2.color;
}

export const calcItemTotalAmount = (item: CartItem) => {
  const quantity = item.quantity;
  const baseItemPrice = item.price;
  const optionsPrice = item.options.reduce((acc, opt) => {
    const selectedDetailPrice = opt.selectedDetail?.price ?? 0;
    const selectedDetailsTotalPrice = opt.selectedDetails.reduce(
      (a, d) => a + d.price,
      0,
    );
    return acc + selectedDetailPrice + selectedDetailsTotalPrice;
  }, 0);

  return (baseItemPrice + optionsPrice) * quantity;
};

export const genMultiChoiceOptionDisplayText = (option: CartItemOption) =>
  option.selectedDetails.map((d) => d.name).join(", ");
