import { useRouteHandle } from "@/hooks";
import HorizontalDivider from "./horizontal-divider";
import TransitionLink from "./transition-link";
import {
  HomeIcon,
  KitchenQueueIcon,
  LedgerIcon,
  MenuTableIcon,
} from "./vectors";

const BOTTOM_NAV_ITEMS = [
  {
    name: "Bán hàng",
    path: "/menu-table",
    icon: MenuTableIcon,
  },
  {
    name: "Sổ quỹ",
    path: "/ledger",
    icon: LedgerIcon,
  },
  {
    name: "Bếp",
    path: "/kitchen",
    icon: KitchenQueueIcon,
  },
  {
    name: "Cửa hàng",
    path: "/menu-store",
    icon: HomeIcon,
  },
  // {
  //   name: "Trang chủ",
  //   path: "/home",
  //   icon: HomeIcon,
  // },
  // {
  //   name: "Danh mục",
  //   path: "/categories",
  //   icon: CategoryIcon,
  // },
  // {
  //   name: "Giỏ hàng",
  //   path: "/cart",
  //   icon: (props) => {
  //     const cart = useAtomValue(cartState);

  //     return (
  //       <div className="relative">
  //         {cart.length > 0 && (
  //           <div className="absolute top-0 left-[18px] h-4 px-1.5 pt-[1.5px] pb-[0.5px] rounded-full bg-[#FF3333] text-white text-[10px] leading-[14px] font-medium shadow-[0_0_0_2px_white]">
  //             {cart.length > 9 ? "9+" : cart.length}
  //           </div>
  //         )}
  //         <CartIcon {...props} />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   name: "Thành viên",
  //   path: "/profile",
  //   icon: ProfileIcon,
  // },
];

export default function Footer() {
  const [handle] = useRouteHandle();

  if (handle?.footerless === true) return null;

  return (
    <>
      <HorizontalDivider />
      <div
        className={`grid w-full px-4 pt-1 grid-cols-${BOTTOM_NAV_ITEMS.length} pb-[max(16px,env(safe-area-inset-bottom))]`}
      >
        {BOTTOM_NAV_ITEMS.map((item) => {
          return (
            <TransitionLink
              to={item.path}
              key={item.path}
              className="flex cursor-pointer flex-col items-center space-y-0.5 p-1 pb-0.5 active:scale-105"
            >
              {({ isActive }) => (
                <>
                  <div className="flex h-6 w-6 items-center justify-center">
                    <item.icon active={isActive} />
                  </div>
                  <div className={`text-2xs ${isActive ? "text-primary" : ""}`}>
                    {item.name}
                  </div>
                </>
              )}
            </TransitionLink>
          );
        })}
      </div>
    </>
  );
}
