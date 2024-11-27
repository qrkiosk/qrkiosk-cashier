import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import { Price } from "@/components/prices";
import Divider from "@/components/section-divider";
import { PrinterIcon } from "@/components/vectors";
import { Order } from "@/types/order";
import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import noop from "lodash/noop";
import { useEffect } from "react";
import { FaAngleRight, FaCirclePlus } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import CompleteOrder from "./CompleteOrder";
import OrderItem from "./OrderItem";
import OrderNote from "./OrderNote";
import ProductPicker from "./ProductPicker";

const useOrder = () => {
  const location = useLocation();
  return location.state?.order as Order;
};

const OrderDetailsPage = () => {
  const order = useOrder();

  useEffect(() => {
    console.log(order);
  }, []);

  return (
    <>
      <FlexDiv col className="!p-0">
        <Divider />

        <Box
          p={4}
          bgColor="var(--zmp-background-white)"
          cursor="pointer"
          onClick={noop}
        >
          <Box
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading size="sm">Khách hàng</Heading>
            <FaAngleRight fontSize={20} color="rgb(109, 109, 109)" />
          </Box>
        </Box>

        <Divider />

        <OrderNote />

        <Divider />

        <Box
          p={4}
          bgColor="var(--zmp-background-white)"
          cursor="pointer"
          onClick={noop}
        >
          <Box
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading size="sm">Giảm giá</Heading>
            <FaCirclePlus fontSize={20} color="rgb(109, 109, 109)" />
          </Box>
        </Box>

        <Divider />

        <Box
          p={4}
          bgColor="var(--zmp-background-white)"
          cursor="pointer"
          onClick={noop}
        >
          <Box
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading size="sm">Phí dịch vụ</Heading>
            <FaCirclePlus fontSize={20} color="rgb(109, 109, 109)" />
          </Box>
        </Box>

        <Divider />

        <Box px={4} py={3} bgColor="var(--zmp-background-white)">
          <Grid templateColumns="repeat(3, 1fr)">
            <GridItem colSpan={2}>
              <Box h="100%" display="flex" alignItems="center">
                <Heading size="sm">Sản phẩm</Heading>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <ProductPicker />
              </Box>
            </GridItem>

            <OrderItem>
              {{
                uniqIdentifier: "x1",
                quantity: 1,
                name: "Cà phê sữa",
                options: [{ id: "o1" }, { id: "o2" }],
                note: "note",
              }}
            </OrderItem>
            <OrderItem>
              {{
                uniqIdentifier: "x1",
                quantity: 1,
                name: "Cà phê sữa",
                options: [{ id: "o3" }, { id: "o4" }],
                note: "note",
              }}
            </OrderItem>
            <OrderItem>
              {{
                uniqIdentifier: "x1",
                quantity: 1,
                name: "Cà phê sữa",
                options: [{ id: "o5" }, { id: "o6" }],
                note: "another note",
              }}
            </OrderItem>
          </Grid>
        </Box>
      </FlexDiv>

      <div className="sticky bottom-0 left-0 right-0 z-50 border-t-[1px] border-t-black/5 bg-[--zmp-background-white] pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col">
            <span className="text-2xs text-subtitle">Tổng cộng ({3})</span>
            <Price
              variant="unstyled"
              size="sm"
              className="font-semibold text-primary"
            >
              {90000}
            </Price>
          </div>
          <div className="flex max-w-[260px] items-center space-x-2">
            <Button className="!p-2" onClick={noop}>
              <PrinterIcon />
            </Button>
            <Button className="!px-4" onClick={noop}>
              Lưu & In
            </Button>
            <CompleteOrder />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
