import FlexDiv from "@/components/flex-div";
import OrderFooter from "@/components/order/order-footer";
import ProductVariantPicker from "@/components/product/product-variant-picker";
import MainMenu from "./main-menu";

const PickOrderProducts = () => {
  return (
    <>
      <FlexDiv col className="p-0">
        <MainMenu />
        <ProductVariantPicker />
      </FlexDiv>

      <OrderFooter />
    </>
  );
};

export default PickOrderProducts;
