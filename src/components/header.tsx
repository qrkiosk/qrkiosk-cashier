import { updateOrderDetails as updateOrderDetailsApi } from "@/api/order";
import { useAuthorizedApi, useRouteHandle } from "@/hooks";
import {
  categoriesStateUpwrapped,
  currentOrderAtom,
  currentOrderQueryAtom,
  tokenAtom,
} from "@/state";
import { cartAtom, isCartDirtyAtom } from "@/state/cart";
import headerLogoImage from "@/static/header-logo.svg";
import { BreadcrumbEntry } from "@/types/common";
import { buildOrderDetails, genOrderReqBody } from "@/utils/order";
import { useDisclosure } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "zmp-ui";
import Breadcrumb from "./breadcrumb";
import Profile from "./profile";
import { BackIcon, Xmark } from "./vectors";

const useUpdateOrderDetailsCallback = () => {
  const updateOrderDetails = useAuthorizedApi(updateOrderDetailsApi);
  const token = useAtomValue(tokenAtom);
  const cart = useAtomValue(cartAtom);
  const order = useAtomValue(currentOrderAtom);
  const setIsCartDirty = useSetAtom(isCartDirtyAtom);
  const { refetch } = useAtomValue(currentOrderQueryAtom);

  return async () => {
    if (!order) return;

    const details = buildOrderDetails(cart);
    try {
      await updateOrderDetails(genOrderReqBody(order, { details }), token);
      // TODO: Notify kitchen
      await refetch();
      setIsCartDirty(false);
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };
};

const Header = () => {
  const {
    isOpen: isExitOrderConfirmVisible,
    onOpen: onOpenExitOrderConfirm,
    onClose: onCloseExitOrderConfirm,
  } = useDisclosure();

  const categories = useAtomValue(categoriesStateUpwrapped);
  const isCartDirty = useAtomValue(isCartDirtyAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, match] = useRouteHandle();

  const updateOrderDetails = useUpdateOrderDetailsCallback();

  const title = useMemo(() => {
    if (location.state?.title && Array.isArray(location.state?.title)) {
      return (
        <Breadcrumb entries={location.state?.title as BreadcrumbEntry[]} />
      );
    }

    if (!handle) return "";

    if (typeof handle.title === "function") {
      return handle.title({ categories, params: match.params });
    }

    return handle.title ?? "";
  }, [handle, categories]);

  const onNavigateBack = () => {
    if (handle?.backBehavior === "confirm-exit-order" && isCartDirty) {
      onOpenExitOrderConfirm();
    } else {
      navigate(-1);
    }
  };

  const showBack = location.key !== "default" && handle?.back !== false;

  if (handle?.headerless === true) return <div className="h-12 w-full py-2" />;

  if (handle?.logo === true) {
    return (
      <div className="z-50 flex h-14 w-full items-center px-4 py-2">
        <img src={headerLogoImage} className="max-h-full flex-none" />
      </div>
    );
  }

  if (handle?.user === true) {
    return (
      <div className="z-50 flex h-14 w-full items-center border-b-[1px] border-b-black/5 p-2">
        <Profile />
      </div>
    );
  }

  return (
    <>
      <div className="z-50 flex h-12 w-full items-center space-x-1 border-b-[1px] border-b-black/5 py-2 pl-2 pr-[106px]">
        {showBack && (
          <div className="cursor-pointer p-2" onClick={onNavigateBack}>
            {handle?.backAppearance === "close" ? <Xmark /> : <BackIcon />}
          </div>
        )}
        <div className="truncate text-xl font-medium">{title}</div>
      </div>

      {handle?.backBehavior === "confirm-exit-order" && (
        <Modal
          visible={isExitOrderConfirmVisible}
          onClose={onCloseExitOrderConfirm}
          title="Lưu ý"
          description="Bạn có muốn lưu thay đổi với bar/bếp trước khi rời khỏi đơn không?"
          actions={[
            {
              text: "Không",
              onClick: async () => {
                await updateOrderDetails();
                onCloseExitOrderConfirm();
                navigate(-1);
              },
            },
            {
              text: "Có",
              highLight: true,
              onClick: async () => {
                await updateOrderDetails();
                // TODO: Notify kitchen
                onCloseExitOrderConfirm();
                navigate(-1);
              },
            },
          ]}
        />
      )}
    </>
  );
};

export default Header;
