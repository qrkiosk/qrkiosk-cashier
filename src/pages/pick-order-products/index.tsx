import MainMenu from "@/components/menu/main-menu";
import SearchResult from "@/components/menu/search-result";
import TopStickyHeader from "@/components/menu/top-sticky-header";
import ProductVariantPicker from "@/components/product/product-variant-picker";
import Footer from "./footer";

const PickOrderProducts = () => {
  return (
    <>
      <TopStickyHeader />
      <div className="flex flex-1 flex-col overflow-auto bg-[--zmp-background-color]">
        <MainMenu />
        <SearchResult />
      </div>
      <ProductVariantPicker />
      <Footer />
    </>
  );
};

export default PickOrderProducts;
