import { useRouteHandle } from "@/hooks";
import { categoriesStateUpwrapped } from "@/state";
import headerLogoImage from "@/static/header-logo.svg";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "./profile";
import { BackIcon } from "./vectors";

export default function Header() {
  const categories = useAtomValue(categoriesStateUpwrapped);
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, match] = useRouteHandle();

  const title = useMemo(() => {
    if (handle) {
      if (typeof handle.title === "function") {
        return handle.title({ categories, params: match.params });
      } else {
        return handle.title;
      }
    }
  }, [handle, categories]);

  const showBack = location.key !== "default" && handle?.back !== false;

  if (handle?.logo) {
    return (
      <div className="flex h-14 w-full items-center px-4 py-2">
        <img src={headerLogoImage} className="max-h-full flex-none" />
      </div>
    );
  }

  if (handle?.user) {
    return (
      <div className="flex h-14 w-full items-center px-2 py-2">
        <Profile />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full items-center space-x-1 py-2 pl-2 pr-[106px]">
      {showBack && (
        <div className="cursor-pointer p-2" onClick={() => navigate(-1)}>
          <BackIcon />
        </div>
      )}
      <div className="truncate text-xl font-medium">{title}</div>
    </div>
  );
}
