import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import Tabs from "@/components/tabs";
import { useRemoveQueriesOnUnmount } from "@/hooks";
import {
  currentMenuTableTabIndexAtom,
  syncLocalTablesEffect,
  tablesQueryAtom,
} from "@/state";
import { useAtom, useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import toast from "react-hot-toast";
import { Spinner } from "zmp-ui";
import TableGrid from "./table-grid";
import ZoneList from "./zone-list";

const MENU_TABLE_TABS = ["Tất cả", "Chờ xác nhận", "Đang sử dụng", "Còn trống"];

const MenuTablePage = () => {
  const [index, setIndex] = useAtom(currentMenuTableTabIndexAtom);
  const {
    data,
    error,
    isLoading,
    refetch: refetchTables,
  } = useAtomValue(tablesQueryAtom);

  useAtom(syncLocalTablesEffect);
  useRemoveQueriesOnUnmount(["tables"]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <Tabs
        items={["Tất cả", "Chờ xác nhận", "Đang sử dụng", "Còn trống"]}
        value={MENU_TABLE_TABS[index]}
        onChange={(tab) => setIndex(MENU_TABLE_TABS.indexOf(tab))}
        renderLabel={(item) => item}
      />

      {(function () {
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
              <p className="text-sm text-subtitle">
                Lỗi: Không thể tải dữ liệu.
              </p>
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    await refetchTables();
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

        if (isEmpty(data)) {
          return (
            <FlexDiv row center>
              <p className="text-sm text-subtitle">Không có dữ liệu.</p>
            </FlexDiv>
          );
        }

        return (
          <>
            <ZoneList />
            <div className="flex flex-1 flex-col overflow-auto">
              {(function () {
                switch (index) {
                  case 0:
                    return <TableGrid.All />;
                  case 1:
                    return <TableGrid.Waiting />;
                  case 2:
                    return <TableGrid.InUse />;
                  case 3:
                    return <TableGrid.Empty />;
                  default:
                    return null;
                }
              })()}
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default MenuTablePage;
