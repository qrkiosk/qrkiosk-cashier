import { updateProductOptionStock as updateProductOptionStockApi } from "@/api/product";
import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import { useAuthorizedApi } from "@/hooks";
import { tokenAtom } from "@/state";
import { productOptionsQueryAtom } from "@/state/product";
import { UpdateProductOptionStockReqBody } from "@/types/product";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Spinner, Switch } from "zmp-ui";
import { Collapse } from "./collapse";

const UpdateAvailabilityOptions = () => {
  const updateProductOptionStock = useAuthorizedApi(
    updateProductOptionStockApi,
  );
  const token = useAtomValue(tokenAtom);
  const {
    data: options,
    isLoading,
    error,
    refetch: refetchProductOptions,
  } = useAtomValue(productOptionsQueryAtom);

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
              await refetchProductOptions();
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
      <div className="flex-1 space-y-4 overflow-y-auto bg-[--zmp-background-color] p-4">
        {options.map((option) => (
          <Collapse
            key={option.id}
            title={
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm font-semibold">{option.name}</span>
                {false && (
                  <Switch
                    defaultChecked={option.isStock}
                    onChange={async (e) => {
                      const isOptionInStock = e.target.checked;
                      const body: UpdateProductOptionStockReqBody = {
                        id: option.id,
                        companyId: option.companyId,
                        storeId: option.storeId,
                        name: option.name,
                        seq: option.seq,
                        isMandatory: option.isMandatory,
                        isMany: option.isMany,
                        isActive: option.isActive,
                        isStock: isOptionInStock,
                        details: option.details.map((d) => ({
                          id: d.id,
                          name: d.name,
                          price: d.price,
                          isActive: d.isActive,
                          isStock: d.isStock,
                        })),
                      };

                      try {
                        await updateProductOptionStock(body, token);
                        setTimeout(refetchProductOptions, 500);
                      } catch {
                        toast.error(
                          "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                        );
                      }
                    }}
                  />
                )}
              </div>
            }
          >
            <div className="space-y-3 p-4">
              {option.details.map((detail) => (
                <div key={detail.id} className="flex items-center">
                  <div className="flex-1 text-sm">{detail.name}</div>
                  <Switch
                    defaultChecked={detail.isStock}
                    onChange={async (e) => {
                      const isDetailInStock = e.target.checked;
                      const body: UpdateProductOptionStockReqBody = {
                        id: option.id,
                        companyId: option.companyId,
                        storeId: option.storeId,
                        name: option.name,
                        seq: option.seq,
                        isMandatory: option.isMandatory,
                        isMany: option.isMany,
                        isActive: option.isActive,
                        isStock: option.isStock,
                        details: option.details.map((d) => ({
                          id: d.id,
                          name: d.name,
                          price: d.price,
                          isActive: d.isActive,
                          isStock:
                            d.id === detail.id ? isDetailInStock : d.isStock,
                        })),
                      };

                      try {
                        await updateProductOptionStock(body, token);
                        setTimeout(refetchProductOptions, 500);
                      } catch {
                        toast.error(
                          "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </Collapse>
        ))}
      </div>
    </FlexDiv>
  );
};

export default UpdateAvailabilityOptions;
