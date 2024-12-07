import { useRouteHandle } from "@/hooks";
import { categoriesStateUpwrapped } from "@/state";
import { isCartDirtyAtom } from "@/state/cart";
import headerLogoImage from "@/static/header-logo.svg";
import { BreadcrumbEntry } from "@/types/common";
import { useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "zmp-ui";
import Breadcrumb from "./breadcrumb";
import Profile from "./profile";
import { BackIcon, Xmark } from "./vectors";

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
          description="Vui lòng thực hiện thao tác Lưu & In đơn hàng trước khi rời khỏi đây. Tất cả chi tiết đơn hàng chưa lưu sẽ bị mất sau khi bạn rời khỏi đơn hàng."
          actions={[
            { text: "Ở lại", close: true },
            {
              text: "Rời khỏi đây",
              highLight: true,
              onClick: () => {
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
