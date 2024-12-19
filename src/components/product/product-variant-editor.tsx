import { ProductPrice } from "@/components/price";
import Divider from "@/components/section-divider";
import { PageSkeleton } from "@/components/skeleton";
import { useProductVariantEditor } from "@/hooks";
import { removeCartItemAtom, updateCartItemAtom } from "@/state/cart";
import {
  enrichProductVariantAtom,
  productVariantAtom,
  productVariantPriceAtom,
  productVariantQtyAtom,
  singleProductQueryAtom,
} from "@/state/product";
import { CartProductVariant } from "@/types/cart";
import { APP_ACCENT_COLOR, APP_DANGER_COLOR } from "@/utils/constants";
import { withThousandSeparators } from "@/utils/number";
import { Button, HStack } from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Sheet } from "zmp-ui";
import ProductOption from "./product-option";
import VariantNote from "./variant-note";

const MIN_QTY = 0;

const EditorBody = () => {
  const { isOpen, onClose } = useProductVariantEditor();
  const { data, isLoading } = useAtomValue(singleProductQueryAtom);
  const productVariant = useAtomValue(productVariantAtom);
  const productVariantPrice = useAtomValue(productVariantPriceAtom);
  const [productVariantQty, updateProductVariantQty] = useAtom(
    productVariantQtyAtom,
  );
  const enrichProductVariantToEdit = useSetAtom(enrichProductVariantAtom);
  const removeFromCart = useSetAtom(removeCartItemAtom);
  const updateCartItem = useSetAtom(updateCartItemAtom);

  useEffect(() => {
    if (isOpen && data != null) {
      enrichProductVariantToEdit(data);
    }
  }, [isOpen, data]);

  if (isLoading || !productVariant) return <PageSkeleton />;

  // `CartOrderItem | null` initially
  // `CartProductVariant` eventually
  const enrichedProductVariant = productVariant as CartProductVariant;

  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-y-auto bg-[--zmp-background-color]">
      <div className="w-full flex-1 overflow-y-auto md:w-1/2">
        <div className="bg-white p-4">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">
              {enrichedProductVariant.name}
            </p>
            <div className="mb-4 flex flex-col items-end">
              <ProductPrice size="lg" emphasizeSalePrice>
                {[
                  enrichedProductVariant.price,
                  enrichedProductVariant.priceSale,
                ]}
              </ProductPrice>
              <span className="mt-1 text-2xs text-subtitle">Giá gốc</span>
            </div>
          </div>
          <p className="mt-2 text-2xs text-subtitle">
            {enrichedProductVariant.description}
          </p>
        </div>
        <Divider />

        {enrichedProductVariant.options.map((option) => (
          <ProductOption key={option.id}>{option}</ProductOption>
        ))}

        <div className="flex flex-col items-center space-y-4 bg-white p-4">
          <div className="flex w-full items-center">
            <span className="text-base font-bold">Thêm lưu ý cho quán</span>
            <span className="ml-2 text-2xs text-subtitle">Không bắt buộc</span>
          </div>
          <VariantNote />
          <HStack maxW="180px">
            <Button
              p={0}
              minW="50px"
              isDisabled={productVariantQty === MIN_QTY}
              onClick={() => updateProductVariantQty("DEC", MIN_QTY)}
            >
              <span className="text-xl text-primary">–</span>
            </Button>
            <div className="min-w-[50px] text-center">
              <span className="text-xl font-bold">{productVariantQty}</span>
            </div>
            <Button
              p={0}
              minW="50px"
              onClick={() => updateProductVariantQty("INC")}
            >
              <span className="text-xl text-primary">＋</span>
            </Button>
          </HStack>
        </div>
        <Divider />
      </div>

      <div className="sticky bottom-0 left-0 right-0 w-full border-t-[1px] border-black/5 bg-white p-3 md:w-1/2">
        {productVariantQty === 0 ? (
          <Button
            variant="solid"
            autoFocus={false}
            colorScheme={APP_DANGER_COLOR}
            w="100%"
            borderRadius="lg"
            size="lg"
            onClick={() => {
              removeFromCart(enrichedProductVariant.uniqIdentifier);
              onClose();
            }}
          >
            Xoá khỏi giỏ hàng
          </Button>
        ) : (
          <Button
            variant="solid"
            autoFocus={false}
            colorScheme={APP_ACCENT_COLOR}
            w="100%"
            borderRadius="lg"
            size="lg"
            onClick={() => {
              updateCartItem();
              onClose();
            }}
          >
            <div className="flex w-full justify-between">
              <span>Cập nhật giỏ hàng</span>
              <span>{withThousandSeparators(productVariantPrice)}</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

const ProductVariantEditor = () => {
  const { isOpen, onClose } = useProductVariantEditor();

  return (
    <Sheet visible={isOpen} onClose={onClose} height="80%">
      <ErrorBoundary
        fallback={
          <p className="p-4 text-center text-sm text-subtitle">
            Lỗi: Không thể tải sản phẩm.
          </p>
        }
      >
        <EditorBody />
      </ErrorBoundary>
    </Sheet>
  );
};

export default ProductVariantEditor;
