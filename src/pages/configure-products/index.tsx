import Tabs from "@/components/tabs";
import { useState } from "react";
import UpdateAvailability from "./update-availability";
import UpdateAvailabilityOptions from "./update-availability-options";

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

      <div className="flex flex-1 flex-col overflow-auto">
        {(function () {
          switch (index) {
            case 0:
              return <UpdateAvailability />;
            case 1:
              return <UpdateAvailabilityOptions />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default ConfigProductsPage;
