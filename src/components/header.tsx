import { useRouteHandle } from "@/hooks";
import { categoriesStateUpwrapped } from "@/state";
import headerLogoImage from "@/static/header-logo.svg";
import { BreadcrumbEntry } from "@/types/common";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "./breadcrumb";
import Profile from "./profile";
import { BackIcon, Xmark } from "./vectors";

const Header = () => {
  const categories = useAtomValue(categoriesStateUpwrapped);
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

  const showBack = location.key !== "default" && handle?.back !== false;

  if (handle?.headerless === true) return null;

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
          <div className="cursor-pointer p-2" onClick={() => navigate(-1)}>
            {handle?.backAppearance === "close" ? <Xmark /> : <BackIcon />}
          </div>
        )}
        <div className="truncate text-xl font-medium">{title}</div>
      </div>
    </>
  );
};

export default Header;
