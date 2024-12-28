import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import MainMenu from "@/components/menu/main-menu";
import SearchResult from "@/components/menu/search-result";
import TopStickyHeader from "@/components/menu/top-sticky-header";
import { categoriesWithProductsQueryAtom } from "@/state/product";
import { CategoryTemplate } from "@/types/product";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Spinner } from "zmp-ui";

const UpdateAvailability = () => {
  const {
    isLoading,
    error,
    refetch: refetchProducts,
  } = useAtomValue(categoriesWithProductsQueryAtom);

  if (isLoading) {
    return (
      <FlexDiv row center>
        <Spinner />
      </FlexDiv>
    );
  }

  if (error) {
    return (
      <FlexDiv col center className="space-y-4">
        <p className="text-sm text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await refetchProducts();
            } catch {
              toast.error("Xảy ra lỗi khi tải dữ liệu.");
            }
          }}
        >
          Tải lại
        </Button>
      </FlexDiv>
    );
  }

  return (
    <FlexDiv col className="!p-0">
      <TopStickyHeader />

      <div className="flex flex-1 flex-col overflow-auto bg-[--zmp-background-color]">
        <MainMenu
          template={CategoryTemplate.LIST}
          updateAvailabilityMode
          readOnly
        />
        <SearchResult
          template={CategoryTemplate.LIST}
          updateAvailabilityMode
          readOnly
        />
      </div>
    </FlexDiv>
  );
};

export default UpdateAvailability;
