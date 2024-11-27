import React from "react";
import { FaAngleRight, FaPlus, FaXmark } from "react-icons/fa6";
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProductPicker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        isRound
        size="sm"
        variant="ghost"
        aria-label="Add product"
        icon={<FaPlus fontSize={24} />}
        onClick={onOpen}
      />
      <Drawer
        size="full"
        placement="bottom"
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Box
            position="sticky"
            top={0}
            left={0}
            right={0}
            zIndex={99}
            bgColor="var(--zmp-background-white)"
            boxShadow="0px 1px 4px rgba(0, 0, 0, 0.1)"
            className="safe-area-top"
          >
            <Box display="flex" alignItems="center" p={3} className="space-x-2">
              <IconButton
                isRound
                size="sm"
                variant="ghost"
                aria-label="Go back"
                icon={<FaXmark fontSize={24} />}
                onClick={onClose}
              />
              <Text color="GrayText">Tầng trệt</Text>
              <FaAngleRight
                fontSize={14}
                fontWeight={300}
                color="rgb(109, 109, 109)"
              />
              <Text color="GrayText">Bàn số 1</Text>
              <FaAngleRight
                fontSize={14}
                fontWeight={300}
                color="rgb(109, 109, 109)"
              />
              <Text fontWeight="semibold">Thêm món</Text>
            </Box>
          </Box>

          {/* <ErrorBoundary
          fallback={
            <Text as="p" textAlign="center" fontSize="sm" p={4}>
              Lỗi: Không thể tải sản phẩm
            </Text>
          }
        >
          <ProductDetails />
        </ErrorBoundary> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProductPicker;
