import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import Customer from "@/components/order-details/customer";
import OrderFooter from "@/components/order-details/order-footer";
import OrderNote from "@/components/order-details/order-note";
import PriceReduction from "@/components/order-details/price-reduction";
import ServiceFee from "@/components/order-details/service-fee";
import Divider from "@/components/section-divider";
import { currentOrderQueryAtom } from "@/state";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import { Spinner } from "zmp-ui";
import Products from "./products";

const OrderView = () => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchOrder,
  } = useAtomValue(currentOrderQueryAtom);

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
        <p className="text-base text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await refetchOrder();
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
        <p className="text-base text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

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
