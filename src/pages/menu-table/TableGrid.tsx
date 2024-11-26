import FlexDiv from "@/components/flex-div";
import { TableTile } from "@/components/tiles";
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

const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
    <FlexDiv col>
      <Grid>
        {tables.map((table) => (
          <div key={table.id} className="col-span-1">
            {(function () {
              switch (table.type) {
                case TableType.TAKE_AWAY:
                  return <TableTile.Takeaway>{table}</TableTile.Takeaway>;
                case TableType.DELIVERY:
                  return <TableTile.Delivery>{table}</TableTile.Delivery>;
                case TableType.ON_SITE:
                  return <TableTile.OnSite>{table}</TableTile.OnSite>;
                default:
                  return null; // just for completeness of the switch statement, not possible in reality
              }
            })()}
          </div>
        ))}
      </Grid>
    </FlexDiv>
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
    <FlexDiv col>
      <Grid>
        {tables.map((table) => (
          <div key={table.id} className="col-span-1">
            <TableTile.OnSite>{table}</TableTile.OnSite>
          </div>
        ))}
      </Grid>
    </FlexDiv>
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
    <FlexDiv col>
      <Grid>
        {tables.map((table) => (
          <div key={table.id} className="col-span-1">
            <TableTile.OnSite>{table}</TableTile.OnSite>
          </div>
        ))}
      </Grid>
    </FlexDiv>
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
    <FlexDiv col>
      <Grid>
        {tables.map((table) => (
          <div key={table.id} className="col-span-1">
            <TableTile.OnSite>{table}</TableTile.OnSite>
          </div>
        ))}
      </Grid>
    </FlexDiv>
  );
};

export default TableGrid;
