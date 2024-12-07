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
import { CartProductVariant } from "@/types/product";
import { APP_ACCENT_COLOR, APP_DANGER_COLOR } from "@/utils/constants";
import { withThousandSeparators } from "@/utils/number";
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Icon } from "zmp-ui";
import ProductOption from "./product-option";
import VariantNote from "./variant-note";

const MIN_QTY = 1;

const EditorBody = () => {
  const { onClose } = useProductVariantEditor();
  const { data, isLoading } = useAtomValue(singleProductQueryAtom);
  const productVariant = useAtomValue(productVariantAtom);
  const productVariantPrice = useAtomValue(productVariantPriceAtom);
  const [productVariantQty, updateProductVariantQty] = useAtom(
    productVariantQtyAtom,
  );
  const enrichProductVariantToEdit = useSetAtom(enrichProductVariantAtom);
  const removeItemFromCart = useSetAtom(removeCartItemAtom);
  const updateItemInCart = useSetAtom(updateCartItemAtom);

  useEffect(() => {
    if (data) enrichProductVariantToEdit(data);
  }, [data]);

  if (isLoading || !productVariant) return <PageSkeleton />;

  // `CartOrderItem | null` initially
  // `CartProductVariant` eventually
  const enrichedProductVariant = productVariant as CartProductVariant;

  return (
    <Box h="100%" display="flex" flexDir="column">
      <Box flexGrow={1} overflowY="auto" bgColor="var(--zmp-background-color)">
        <Image
          src={enrichedProductVariant.url}
          alt=""
          objectFit="cover"
          w="100%"
          minHeight="260px"
          maxHeight="260px"
        />

        <Box p={4} bgColor="var(--zmp-background-white)">
          <Box display="flex" justifyContent="space-between">
            <Heading size="sm">{enrichedProductVariant.name}</Heading>
            <Box display="flex" flexDir="column" alignItems="flex-end" mb={4}>
              <ProductPrice size="lg" emphasizeSalePrice>
                {[
                  enrichedProductVariant.price,
                  enrichedProductVariant.priceSale,
                ]}
              </ProductPrice>
              <Text as="sub" color="gray" fontSize="xs" mt={1}>
                Giá gốc
              </Text>
            </Box>
          </Box>
          <Text color="GrayText" fontSize="xs" mt={2}>
            {enrichedProductVariant.description}
          </Text>
        </Box>
        <Divider />

        {enrichedProductVariant.options.map((option) => (
          <ProductOption key={option.id}>{option}</ProductOption>
        ))}

        <Box
          p={4}
          bgColor="var(--zmp-background-white)"
          display="flex"
          flexDir="column"
          alignItems="center"
        >
          <Box w="100%" mb={3} display="flex" alignItems="flex-end">
            <Heading size="sm">Thêm lưu ý cho quán</Heading>
            <Text fontSize="xs" color="GrayText" ml={2}>
              Không bắt buộc
            </Text>
          </Box>
          <VariantNote />
          <HStack maxW="180px">
            <Button
              p={0}
              minW="50px"
              isDisabled={productVariantQty === MIN_QTY}
              onClick={() => updateProductVariantQty("DEC", MIN_QTY)}
            >
              <Text fontSize="xl" color="var(--chakra-colors-blue-500)">
                –
              </Text>
            </Button>
            <Box minW="50px" textAlign="center">
              <Heading fontSize="xl">{productVariantQty}</Heading>
            </Box>
            <Button
              p={0}
              minW="50px"
              onClick={() => updateProductVariantQty("INC")}
            >
              <Text fontSize="xl" color="var(--chakra-colors-blue-500)">
                ＋
              </Text>
            </Button>
          </HStack>
        </Box>
        <Divider />
      </Box>

      <Box
        className="sticky bottom-0 left-0 right-0 p-3"
        bgColor="var(--zmp-background-white)"
        boxShadow="0px -4px 6px rgba(0, 0, 0, 0.1)"
      >
        {productVariantQty === 0 ? (
          <Button
            variant="solid"
            autoFocus={false}
            colorScheme={APP_DANGER_COLOR}
            w="100%"
            borderRadius="lg"
            size="lg"
            onClick={() => {
              removeItemFromCart(enrichedProductVariant.uniqIdentifier);
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
              updateItemInCart();
              onClose();
            }}
          >
            <div className="flex w-full justify-between">
              <span>Cập nhật giỏ hàng</span>
              <span>{withThousandSeparators(productVariantPrice)}</span>
            </div>
          </Button>
        )}
      </Box>
    </Box>
  );
};

const ProductVariantEditor = () => {
  const { isOpen, onClose } = useProductVariantEditor();

  return (
    <Drawer
      size="full"
      placement="bottom"
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <IconButton
          isRound={true}
          autoFocus={false}
          position="absolute"
          top="var(--zaui-safe-area-inset-top, 16px)"
          left={3} // 12px
          variant="outline"
          aria-label="Close"
          boxShadow="0 0 6px rgba(0, 0, 0, 0.15)"
          bgColor="var(--zmp-background-white)"
          _hover={{ bgColor: "var(--zmp-background-white)" }}
          fontSize="md"
          zIndex={999}
          icon={<Icon icon="zi-close" />}
          onClick={onClose}
        />
        <ErrorBoundary
          fallback={
            <Text as="p" textAlign="center" fontSize="sm" p={4}>
              Lỗi: Không thể tải sản phẩm.
            </Text>
          }
        >
          <EditorBody />
        </ErrorBoundary>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductVariantEditor;
