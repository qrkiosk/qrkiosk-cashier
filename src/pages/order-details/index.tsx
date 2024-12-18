import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import Customer from "@/components/order-details/customer";
import OrderFooter from "@/components/order-details/order-footer";
import OrderNote from "@/components/order-details/order-note";
import PageHeader from "@/components/order-details/page-header";
import PriceReduction from "@/components/order-details/price-reduction";
import ServiceFee from "@/components/order-details/service-fee";
import Divider from "@/components/section-divider";
import { currentOrderQueryAtom, isOrderWaitingAtom } from "@/state";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import { Spinner } from "zmp-ui";
import Products from "./products";

const OrderDetailsPage = () => {
  const isOrderWaiting = useAtomValue(isOrderWaitingAtom);
  const {
    data,
    isLoading,
    error,
    refetch: refetchOrder,
  } = useAtomValue(currentOrderQueryAtom);

  return (
    <>
      <PageHeader />

      {(function () {
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
              <p className="text-sm text-subtitle">
                Lỗi: Không thể tải dữ liệu.
              </p>
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
              <p className="text-sm text-subtitle">Không có dữ liệu.</p>
            </FlexDiv>
          );
        }

        return (
          <>
            <FlexDiv
              col
              className={classNames("relative !p-0", {
                "pointer-events-none opacity-75": isOrderWaiting,
              })}
            >
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
      })()}
    </>
  );
};

export default OrderDetailsPage;
