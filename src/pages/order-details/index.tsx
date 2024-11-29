import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import FloatingButton from "@/components/floating-button";
import { Price } from "@/components/prices";
import Divider from "@/components/section-divider";
import { PrinterIcon } from "@/components/vectors";
import { currentOrderAtom } from "@/state";
import { BreadcrumbEntry } from "@/types/common";
import { Grid, GridItem } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import noop from "lodash/noop";
import { FaAngleRight, FaCirclePlus } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import CompleteOrder from "./complete-order";
import OrderItem from "./order-item";
import OrderNote from "./order-note";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
  const order = useAtomValue(currentOrderAtom);

  return (
    <>
      <FlexDiv col className="p-0">
        <Divider />

        <div
          className="cursor-pointer bg-[--zmp-background-white] p-4"
          onClick={() =>
            navigate("/choose-order-customer", {
              state: {
                title: [...breadcrumb, { text: "Khách hàng" }],
              },
            })
          }
        >
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Khách hàng</span>
              <span className="text-inactive">{order?.customerName}</span>
            </div>
            <FaAngleRight fontSize={16} color="rgb(109, 109, 109)" />
          </div>
        </div>

        <Divider />
        <OrderNote />
        <Divider />

        <div
          className="cursor-pointer bg-[--zmp-background-white] p-4"
          onClick={noop}
        >
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Giảm giá</span>
              {/* <span className="text-inactive">{orderNote}</span> */}
            </div>
            <FaCirclePlus fontSize={16} color="rgb(109, 109, 109)" />
          </div>
        </div>

        <Divider />

        <div
          className="cursor-pointer bg-[--zmp-background-white] p-4"
          onClick={noop}
        >
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Phí dịch vụ</span>
              {/* <span className="text-inactive">{orderNote}</span> */}
            </div>
            <FaCirclePlus fontSize={16} color="rgb(109, 109, 109)" />
          </div>
        </div>

        <Divider />

        <div className="bg-[--zmp-background-white] px-4 py-3">
          <Grid templateColumns="repeat(3, 1fr)">
            <GridItem colSpan={3}>
              <div className="flex h-full items-center">
                <p className="font-semibold">Sản phẩm</p>
              </div>
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
                uniqIdentifier: "x2",
                quantity: 1,
                name: "Cà phê sữa",
                options: [{ id: "o3" }, { id: "o4" }],
                note: "note",
              }}
            </OrderItem>
            <OrderItem>
              {{
                uniqIdentifier: "x3",
                quantity: 1,
                name: "Cà phê sữa",
                options: [{ id: "o5" }, { id: "o6" }],
                note: "another note",
              }}
            </OrderItem>
            <OrderItem>
              {{
                uniqIdentifier: "x4",
                quantity: 1,
                name: "Cà phê sữa",
                options: [{ id: "o5" }, { id: "o6" }],
                note: "another note",
              }}
            </OrderItem>
          </Grid>
        </div>

        <FloatingButton className="bottom-[100px] right-5 bg-gray-700 hover:bg-gray-800" />
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
            <Button variant="secondary" className="!p-2" onClick={noop}>
              <PrinterIcon />
            </Button>
            <Button variant="secondary" className="!px-4" onClick={noop}>
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
