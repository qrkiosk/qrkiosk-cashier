import ProductVariantPicker from "@/components/product/product-variant-picker";
import Footer from "./footer";
import MainMenu from "./main-menu";
import SearchResult from "./search-result";
import TopStickyHeader from "./top-sticky-header";

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
