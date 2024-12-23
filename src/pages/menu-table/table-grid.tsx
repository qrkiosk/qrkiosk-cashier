import FlexDiv from "@/components/flex-div";
import Tile from "@/components/tile";
import {
  zonedEmptyTablesAtom,
  zonedInUseTablesAtom,
  zonedTablesAtom,
  zonedWaitingTablesAtom,
} from "@/state";
import { TableType } from "@/types/company";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { FC, ReactNode } from "react";

const GridContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
};

const TableGrid = {} as Record<"All" | "Waiting" | "InUse" | "Empty", FC>;

TableGrid.All = () => {
  const tables = useAtomValue(zonedTablesAtom);

  if (isEmpty(tables)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

  return (
    <GridContainer>
      {tables.map((table) => (
        <div key={table.id} className="col-span-1">
          {(function () {
            switch (table.type) {
              case TableType.TAKE_AWAY:
                return <Tile.Takeaway table={table} />;
              case TableType.DELIVERY:
                return <Tile.Delivery table={table} />;
              case TableType.ON_SITE:
                return <Tile.OnSite table={table} />;
              default:
                return null; // just for completeness of the switch statement, not possible in reality
            }
          })()}
        </div>
      ))}
    </GridContainer>
  );
};

TableGrid.Empty = () => {
  const tables = useAtomValue(zonedEmptyTablesAtom);

  if (isEmpty(tables)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

  return (
    <GridContainer>
      {tables.map((table) => (
        <div key={table.id} className="col-span-1">
          <Tile.OnSite table={table} />
        </div>
      ))}
    </GridContainer>
  );
};

TableGrid.InUse = () => {
  const tables = useAtomValue(zonedInUseTablesAtom);

  if (isEmpty(tables)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

  return (
    <GridContainer>
      {tables.map((table) => (
        <div key={table.id} className="col-span-1">
          <Tile.OnSite table={table} />
        </div>
      ))}
    </GridContainer>
  );
};

TableGrid.Waiting = () => {
  const tables = useAtomValue(zonedWaitingTablesAtom);

  if (isEmpty(tables)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

  return (
    <GridContainer>
      {tables.map((table) => (
        <div key={table.id} className="col-span-1">
          <Tile.OnSite table={table} />
        </div>
      ))}
    </GridContainer>
  );
};

export default TableGrid;
