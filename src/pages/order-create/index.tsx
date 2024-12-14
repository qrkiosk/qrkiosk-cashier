import FlexDiv from "@/components/flex-div";
import OrderFooter from "@/components/order/order-footer";
import Divider from "@/components/section-divider";
import Customer from "./customer";
import OrderNote from "./order-note";
import PriceReduction from "./price-reduction";
import Products from "./products";
import ServiceFee from "./service-fee";

const OrderCreatePage = () => {
  return (
    <>
      <FlexDiv col className="!p-0">
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

        <Divider />
      </FlexDiv>

      <OrderFooter />
    </>
  );
};

export default OrderCreatePage;
