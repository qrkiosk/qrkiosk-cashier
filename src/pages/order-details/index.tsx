import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import FloatingButton from "@/components/floating-button";
import Divider from "@/components/section-divider";
import { currentOrderQueryAtom, tokenAtom } from "@/state";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import { Spinner } from "zmp-ui";
import Customer from "./customer";
import OrderFooter from "./order-footer";
import OrderNote from "./order-note";
import PriceReduction from "./price-reduction";
import Products from "./products";
import ServiceFee from "./service-fee";

const OrderDetailsPage = () => {
  const token = useAtomValue(tokenAtom);
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

  console.log(data); // đoạn này ok r nè
  console.log(token);

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

        <FloatingButton className="bottom-[100px] right-5 bg-gray-700 hover:bg-gray-800" />
      </FlexDiv>

      <OrderFooter />
    </>
  );
};

export default OrderDetailsPage;
