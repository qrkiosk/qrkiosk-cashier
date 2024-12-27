import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import Spinner from "@/components/spinner";
import Tabs from "@/components/tabs";
import { useState } from "react";
import toast from "react-hot-toast";
import ToggleOptions from "./toggle-options";
import UpdateStock from "./update-stock";

const CONFIG_PRODUCTS_TABS = ["Món", "Tùy chọn món"];

const ConfigProductsPage = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <Tabs
        items={CONFIG_PRODUCTS_TABS}
        value={CONFIG_PRODUCTS_TABS[index]}
        onChange={(tab) => setIndex(CONFIG_PRODUCTS_TABS.indexOf(tab))}
        renderLabel={(item) => item}
      />

      {(function () {
        if (/* isLoading */ false) {
          return (
            <FlexDiv row center>
              <Spinner />
            </FlexDiv>
          );
        }

        if (/* error */ false) {
          return (
            <FlexDiv col center className="space-y-4">
              <p className="text-sm text-subtitle">
                Lỗi: Không thể tải dữ liệu.
              </p>
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    // await refetchTables();
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

        if (/* isEmpty(data) */ false) {
          return (
            <FlexDiv row center>
              <p className="text-sm text-subtitle">Không có dữ liệu.</p>
            </FlexDiv>
          );
        }

        return (
          <div className="flex flex-1 flex-col overflow-auto">
            {(function () {
              switch (index) {
                case 0:
                  return <UpdateStock />;
                case 1:
                  return <ToggleOptions />;
                default:
                  return null;
              }
            })()}
          </div>
        );
      })()}
    </div>
  );
};

export default ConfigProductsPage;
