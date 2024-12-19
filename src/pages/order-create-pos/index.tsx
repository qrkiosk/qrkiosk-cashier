import MainMenu from "@/components/menu/main-menu";
import SearchAndCategories from "@/components/menu/search-and-categories";
import SearchResult from "@/components/menu/search-result";
import PageHeader from "@/components/order-create/page-header";
import OrderView from "./order-view";

const OrderCreatePosPage = () => {
  return (
    <>
      <PageHeader />

      <div className="grid flex-1 grid-cols-10 overflow-y-auto">
        <div className="col-span-2 flex flex-col overflow-y-auto border-r-[1px] border-black/10 bg-white">
          <SearchAndCategories />
        </div>

        <div className="col-span-5 overflow-y-auto">
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

export default OrderCreatePosPage;
