import FlexDiv from "@/components/flex-div";
import Customer from "@/components/order-create/customer";
import OrderFooter from "@/components/order-create/order-footer";
import OrderNote from "@/components/order-create/order-note";
import PriceReduction from "@/components/order-create/price-reduction";
import ServiceFee from "@/components/order-create/service-fee";
import Divider from "@/components/section-divider";
import Products from "./products";

const OrderView = () => {
  return (
    <>
      <FlexDiv col className="!p-0">
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

export default OrderView;
