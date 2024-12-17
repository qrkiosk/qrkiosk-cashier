import { createOrder as createOrderApi } from "@/api/order";
import Breadcrumb from "@/components/breadcrumb";
import { BackIcon } from "@/components/vectors";
import { useAuthorizedApi, useResetDraftOrderAndExitCallback } from "@/hooks";
import { currentTableAtom, draftOrderAtom, tokenAtom } from "@/state";
import { cartAtom, isCartEmptyAtom } from "@/state/cart";
import { BreadcrumbEntry } from "@/types/common";
import { OrderStatus } from "@/types/order";
import { ShippingType } from "@/types/shipping";
import { buildOrderDetails } from "@/utils/order";
import { useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Modal } from "zmp-ui";

const useCreateOrderCallback = () => {
  const createOrder = useAuthorizedApi(createOrderApi);
  const token = useAtomValue(tokenAtom);
  const cart = useAtomValue(cartAtom);
  const order = useAtomValue(draftOrderAtom);
  const table = useAtomValue(currentTableAtom);

  return async () => {
    if (!table || isEmpty(order.customer)) {
      toast.error("Bạn chưa chọn khách hàng.");
      return;
    }

    const details = buildOrderDetails(cart);
    try {
      await createOrder(
        {
          id: order.id ?? null,
          companyId: table.companyId,
          storeId: table.storeId,
          tableId: table.id,
          tableName: table.name,
          customer: !isEmpty(order.customer) ? order.customer : null,
          paymentType: null,
          sourceType: ShippingType.ON_SITE,
          note: order.note ?? "",
          discountAmount: order.discountAmount ?? 0,
          discountPercentage: order.discountPercentage ?? 0,
          discountVoucher: order.discountVoucher ?? 0,
          serviceFee: order.serviceFee ?? 0,
          serviceFeePercentage: order.serviceFeePercentage ?? 0,
          status: OrderStatus.PROCESS,
          isActive: true,
          details,
        },
        token,
      );
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };
};

const PageHeader = () => {
  const {
    isOpen: isExitConfirmVisible,
    onOpen: onOpenExitConfirm,
    onClose: onCloseExitConfirm,
  } = useDisclosure();

  const location = useLocation();
  const entries: BreadcrumbEntry[] = location.state?.title ?? [];
  const isCartEmpty = useAtomValue(isCartEmptyAtom);
  const createOrder = useCreateOrderCallback();
  const resetDraftOrderAndExit = useResetDraftOrderAndExitCallback();

  const onExitDraftOrder = () => {
    onCloseExitConfirm();
    resetDraftOrderAndExit();
  };

  const onNavigateBack = () => {
    if (!isCartEmpty) {
      onOpenExitConfirm();
    } else {
      onExitDraftOrder();
    }
  };

  return (
    <>
      <div className="z-50 flex h-12 w-full items-center space-x-1 border-b-[1px] border-b-black/5 bg-white py-2 pl-2 pr-[106px]">
        <div className="cursor-pointer p-2" onClick={onNavigateBack}>
          <BackIcon />
        </div>
        <div className="truncate text-xl font-medium">
          <Breadcrumb entries={entries} />
        </div>
      </div>

      <Modal
        visible={isExitConfirmVisible}
        onClose={onCloseExitConfirm}
        title="Lưu ý"
        description="Bạn có muốn lưu thay đổi với bar/bếp trước khi rời khỏi đơn không?"
        actions={[
          {
            text: "Không",
            onClick: async () => {
              await createOrder();
              onExitDraftOrder();
            },
          },
          {
            text: "Có",
            highLight: true,
            onClick: async () => {
              await createOrder();
              // TODO: (await) Notify kitchen

              toast.success("Thông báo đơn hàng cho bar/bếp thành công.");
              onExitDraftOrder();
            },
          },
        ]}
      />
    </>
  );
};

export default PageHeader;
