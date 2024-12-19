import MainMenu from "@/components/menu/main-menu";
import SearchAndCategories from "@/components/menu/search-and-categories";
import SearchResult from "@/components/menu/search-result";
import PageHeader from "@/components/order-details/page-header";
import { isOrderWaitingAtom } from "@/state";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import OrderView from "./order-view";

const OrderDetailsPosPage = () => {
  const isOrderWaiting = useAtomValue(isOrderWaitingAtom);

  return (
    <>
      <PageHeader />

      <div className="grid flex-1 grid-cols-10 overflow-y-auto">
        <div
          className={classNames(
            "col-span-2 flex flex-col overflow-y-auto border-r-[1px] border-black/10 bg-white",
            { "pointer-events-none opacity-75": isOrderWaiting },
          )}
        >
          <SearchAndCategories />
        </div>

        <div
          className={classNames("col-span-5 overflow-y-auto", {
            "pointer-events-none opacity-75": isOrderWaiting,
          })}
        >
          <MainMenu />
          <SearchResult />
        </div>

        <div className="col-span-3 flex flex-col overflow-y-auto border-l-[1px] border-black/10">
          <OrderView />
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPosPage;
