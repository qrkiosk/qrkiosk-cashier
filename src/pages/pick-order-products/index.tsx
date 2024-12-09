import FlexDiv from "@/components/flex-div";
import OrderFooter from "@/components/order/order-footer";
import ProductVariantPicker from "@/components/product/product-variant-picker";
import CategoryList from "./category-list";
import MainMenu from "./main-menu";

const PickOrderProducts = () => {
  return (
    <>
      <CategoryList />
      <FlexDiv col className="p-0">
        <MainMenu />
        <ProductVariantPicker />
      </FlexDiv>
      <OrderFooter />
    </>
  );
};

export default PickOrderProducts;
