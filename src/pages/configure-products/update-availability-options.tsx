import FlexDiv from "@/components/flex-div";
import { productOptionsQueryAtom } from "@/state/product";
import { Option, OptionDetail } from "@/types/product";
import { useAtomValue } from "jotai";
import { Switch } from "zmp-ui";

const UpdateAvailabilityOptions = () => {
  const {
    isLoading,
    error,
    refetch: refetchProductOptions,
  } = useAtomValue(productOptionsQueryAtom);

  // if (isLoading) {
  //   return (
  //     <FlexDiv row center>
  //       <Spinner />
  //     </FlexDiv>
  //   );
  // }

  // if (error) {
  //   return (
  //     <FlexDiv col center className="space-y-4">
  //       <p className="text-sm text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
  //       <Button
  //         variant="secondary"
  //         onClick={async () => {
  //           try {
  //             await refetchProductOptions();
  //           } catch {
  //             toast.error("Xảy ra lỗi khi tải dữ liệu.");
  //           }
  //         }}
  //       >
  //         Tải lại
  //       </Button>
  //     </FlexDiv>
  //   );
  // }

  return (
    <FlexDiv col className="!p-0">
      <div className="flex-1 space-y-4 overflow-y-auto bg-[--zmp-background-color] p-4">
        {[
          {
            id: "1",
            name: "Đường",
            isActive: true,
            isStock: true,
            details: [
              {
                id: "1-1",
                name: "Nhiều đường",
                isActive: true,
                isStock: true,
              },
              {
                id: "1-2",
                name: "Bình thường",
                isActive: true,
                isStock: true,
              },
              {
                id: "1-3",
                name: "Ít đường",
                isActive: true,
                isStock: true,
              },
              {
                id: "1-4",
                name: "Không đường",
                isActive: true,
                isStock: true,
              },
            ] as OptionDetail[],
          } as Option,
          {
            id: "2",
            name: "Đá",
            isActive: true,
            isStock: true,
            details: [
              {
                id: "2-1",
                name: "Nhiều đá",
                isActive: true,
                isStock: true,
              },
              {
                id: "2-2",
                name: "Bình thường",
                isActive: true,
                isStock: false,
              },
              {
                id: "2-3",
                name: "Ít đá",
                isActive: true,
                isStock: true,
              },
              {
                id: "2-4",
                name: "Không đá",
                isActive: true,
                isStock: true,
              },
            ] as OptionDetail[],
          } as Option,
        ].map((option) => (
          <div
            key={option.id}
            className="rounded-xl border-[1px] border-black/5 bg-white"
          >
            <div className="border-b-[1px] p-4 text-sm font-semibold">
              {option.name}
            </div>
            <div className="space-y-3 p-4 text-sm">
              {option.details.map((detail) => (
                <div key={detail.id} className="flex items-center">
                  <div className="flex-1 text-sm">{detail.name}</div>
                  <Switch
                    defaultChecked={detail.isStock}
                    onChange={(e) => {
                      console.log(detail.id, e.target.checked);
                      // TODO: Call API to update availability of option detail
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FlexDiv>
  );
};

export default UpdateAvailabilityOptions;
