import { ProductPrice } from "@/components/price";
import { useProductVariantPicker } from "@/hooks";
import { Product } from "@/types/product";
import { APP_ACCENT_COLOR } from "@/utils/constants";
import { Box, Card, IconButton, Image, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { Icon } from "zmp-ui";

const ProductItem = {} as {
  Banner: React.FC<{ product: Product }>;
  Grid: React.FC<{ product: Product }>;
  List: React.FC<{
    product: Product;
    readOnly?: boolean;
    updateAvailabilityMode?: boolean;
  }>;
};

ProductItem.Banner = ({ product }) => {
  const { onOpen } = useProductVariantPicker();
  const selectProduct = useCallback(() => {
    onOpen(product.id);
  }, [product.id]);

  return (
    <Card
      direction="row"
      overflow="hidden"
      variant="unstyled"
      borderRadius="2xl"
      boxShadow="0px 0px 4px rgba(0, 0, 0, 0.15)"
      p={2.5}
      onClick={selectProduct}
    >
      <div className="relative flex flex-1 space-x-2">
        <Image
          src={product.url}
          alt="Banner Product Image"
          loading="lazy"
          borderRadius="xl"
          objectFit="cover"
          minW="96px"
          maxW="96px"
        />
        <div className="flex flex-col">
          <Box flexGrow={1}>
            <Text fontSize="sm">{product.name}</Text>
            <Text color="GrayText" fontSize="xs" className="two-line-ellipsis">
              {product.description}
            </Text>
          </Box>
          <ProductPrice pb={2}>
            {[product.price, product.priceSale]}
          </ProductPrice>
        </div>
        <IconButton
          icon={<Icon size={14} icon="zi-plus" />}
          isRound={true}
          variant="solid"
          colorScheme={APP_ACCENT_COLOR}
          aria-label="Add"
          size="sm"
          position="absolute"
          right={0}
          bottom={0}
          onClick={selectProduct}
        />
      </div>
    </Card>
  );
};

ProductItem.Grid = ({ product }) => {
  const { onOpen } = useProductVariantPicker();
  const selectProduct = useCallback(() => {
    onOpen(product.id);
  }, [product.id]);

  return (
    <div className="space-y-2" onClick={selectProduct}>
      <div className="relative aspect-square w-full">
        <Image
          borderRadius="2xl"
          loading="lazy"
          src={product.url}
          alt="Grid Product Image"
          className="absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-lg bg-skeleton object-cover object-center"
        />
        <IconButton
          icon={<Icon size={14} icon="zi-plus" />}
          isRound={true}
          variant="solid"
          colorScheme={APP_ACCENT_COLOR}
          aria-label="Add"
          size="sm"
          position="absolute"
          right="6px"
          bottom="6px"
          onClick={selectProduct}
        />
      </div>
      <Text fontSize="sm">{product.name}</Text>
      <ProductPrice pb={2}>{[product.price, product.priceSale]}</ProductPrice>
    </div>
  );
};

ProductItem.List = ({
  product,
  readOnly = false,
  updateAvailabilityMode = false,
}) => {
  const { onOpen } = useProductVariantPicker();
  const selectProduct = useCallback(() => {
    if (!readOnly) onOpen(product.id);
  }, [product.id]);

  return (
    <Card
      direction="row"
      overflow="hidden"
      variant="unstyled"
      onClick={selectProduct}
    >
      <div className="relative flex flex-1 space-x-2">
        <Image
          src={product.url}
          alt="List Product Image"
          loading="lazy"
          borderRadius="xl"
          objectFit="cover"
          minW={updateAvailabilityMode ? "48px" : "96px"}
          maxW={updateAvailabilityMode ? "48px" : "96px"}
        />
        <div className="flex flex-col">
          <div className="flex-1">
            <p className="text-sm">{product.name}</p>
            {!updateAvailabilityMode && (
              <p className="two-line-ellipsis text-2xs text-subtitle">
                {product.description}
              </p>
            )}
          </div>
          <ProductPrice pb={updateAvailabilityMode ? 0 : 2}>
            {[product.price, product.priceSale]}
          </ProductPrice>
        </div>
        {!readOnly && (
          <IconButton
            icon={<Icon size={14} icon="zi-plus" />}
            isRound={true}
            variant="solid"
            colorScheme={APP_ACCENT_COLOR}
            aria-label="Add"
            size="sm"
            position="absolute"
            right={0}
            bottom={0}
            onClick={selectProduct}
          />
        )}
      </div>
    </Card>
  );
};

export default ProductItem;
