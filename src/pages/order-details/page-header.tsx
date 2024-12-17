import { updateOrderDetails as updateOrderDetailsApi } from "@/api/order";
import Breadcrumb from "@/components/breadcrumb";
import { BackIcon } from "@/components/vectors";
import { useAuthorizedApi, useResetOrderDetailsAndExitCallback } from "@/hooks";
import { currentOrderAtom, tokenAtom } from "@/state";
import { cartAtom, isCartDirtyAtom } from "@/state/cart";
import { BreadcrumbEntry } from "@/types/common";
import { buildOrderDetails, genOrderReqBody } from "@/utils/order";
import { useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Modal } from "zmp-ui";

const useUpdateOrderDetailsCallback = () => {
  const updateOrderDetails = useAuthorizedApi(updateOrderDetailsApi);
  const token = useAtomValue(tokenAtom);
  const cart = useAtomValue(cartAtom);
  const order = useAtomValue(currentOrderAtom);

  return async () => {
    if (!order) return;

    const details = buildOrderDetails(cart);
    const body = genOrderReqBody(order, { details });

    try {
      await updateOrderDetails(body, token);
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

  const isCartDirty = useAtomValue(isCartDirtyAtom);
  const location = useLocation();
  const entries: BreadcrumbEntry[] = location.state?.title ?? [];
  const updateOrderDetails = useUpdateOrderDetailsCallback();

  const resetOrderDetailsAndExit = useResetOrderDetailsAndExitCallback();

  const onExitOrder = () => {
    onCloseExitConfirm();
    resetOrderDetailsAndExit();
  };

  const onNavigateBack = () => {
    if (isCartDirty) {
      onOpenExitConfirm();
    } else {
      onExitOrder();
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
              await updateOrderDetails();
              onExitOrder();
            },
          },
          {
            text: "Có",
            highLight: true,
            onClick: async () => {
              await updateOrderDetails();
              // TODO: (await) Notify kitchen

              toast.success("Thông báo đơn hàng cho bar/bếp thành công.");
              onExitOrder();
            },
          },
        ]}
      />
    </>
  );
};

export default PageHeader;
