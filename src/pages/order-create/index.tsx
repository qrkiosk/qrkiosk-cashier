import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import Divider from "@/components/section-divider";
import { currentOrderQueryAtom } from "@/state";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import { Spinner } from "zmp-ui";
import OrderFooter from "../../components/order/order-footer";
import Customer from "./customer";
import OrderNote from "./order-note";
import PriceReduction from "./price-reduction";
import Products from "./products";
import ServiceFee from "./service-fee";

const OrderCreatePage = () => {
  const { data, isLoading, error, refetch } = useAtomValue(
    currentOrderQueryAtom,
  );

  if (isLoading) {
    return (
      <FlexDiv row center>
        <Spinner />
      </FlexDiv>
    );
  }

  if (error) {
    return (
      <FlexDiv col center className="space-y-4">
        <p className="text-sm text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await refetch();
            } catch {
              toast.error("Xảy ra lỗi khi tải dữ liệu.");
            }
          }}
        >
          Tải lại
        </Button>
      </FlexDiv>
    );
  }

  if (isEmpty(data)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

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
