import FlexDiv from "@/components/flex-div";
import Divider from "@/components/section-divider";
import Customer from "./customer";
import OrderFooter from "./order-footer";
import OrderNote from "./order-note";
import PageHeader from "./page-header";
import PriceReduction from "./price-reduction";
import Products from "./products";
import ServiceFee from "./service-fee";

const OrderCreatePage = () => {
  return (
    <>
      <PageHeader />

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
