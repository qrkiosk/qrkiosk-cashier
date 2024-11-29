import FlexDiv from "@/components/flex-div";
import FloatingButton from "@/components/floating-button";
import Divider from "@/components/section-divider";
import Customer from "./customer";
import OrderFooter from "./order-footer";
import OrderNote from "./order-note";
import PriceReduction from "./price-reduction";
import Products from "./products";
import ServiceFee from "./service-fee";

const OrderDetailsPage = () => {
  return (
    <>
      <FlexDiv col className="p-0">
        <Divider />
        <Customer />

        <Divider />
        <OrderNote />

        <Divider />
        <PriceReduction />

        <Divider />
        <ServiceFee />

        <Divider />
        <Products />

        <FloatingButton className="bottom-[100px] right-5 bg-gray-700 hover:bg-gray-800" />
      </FlexDiv>

      <OrderFooter />
    </>
  );
};

export default OrderDetailsPage;
