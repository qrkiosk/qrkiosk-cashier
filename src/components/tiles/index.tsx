import { BreadcrumbEntry } from "@/types/common";
import { Table } from "@/types/company";
import { withThousandSeparators } from "@/utils/number";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { FaBagShopping, FaFileLines, FaTruckFast } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

type TileProps = {
  children: React.ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
};

const Tile = ({ children, highlighted = false, onClick }: TileProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "flex min-h-[100px] cursor-pointer rounded-lg border-[0.5px] border-black/15 p-4 shadow-black",
        {
          "bg-blue-300": highlighted,
          "bg-white": !highlighted,
        },
      )}
    >
      {children}
    </div>
  );
};

const TableTile = {} as {
  Takeaway: React.FC<{ table: Table }>;
  Delivery: React.FC<{ table: Table }>;
  OnSite: React.FC<{ table: Table }>;
};

TableTile.Takeaway = ({ table }) => {
  return (
    <Tile highlighted={!isEmpty(table.orders)}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center space-x-1">
          <FaBagShopping />
          <div className="text-sm font-semibold">{table.name}</div>
        </div>
        <div className="flex-1" />
      </div>
    </Tile>
  );
};

TableTile.Delivery = ({ table }) => {
  return (
    <Tile highlighted={!isEmpty(table.orders)}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center space-x-1">
          <FaTruckFast />
          <div className="text-sm font-semibold">{table.name}</div>
        </div>
        <div className="flex-1" />
      </div>
    </Tile>
  );
};

TableTile.OnSite = ({ table }) => {
  const hasOrders = !isEmpty(table.orders);
  const navigate = useNavigate();

  return (
    <Tile
      highlighted={hasOrders}
      onClick={() => {
        if (isEmpty(table.orders)) return; // TODO: Handle create at-counter order creation flow later

        const order = table.orders[0];
        const title: BreadcrumbEntry[] = [
          {
            text: table.zoneName,
            nav: { path: "/menu-table" },
          },
          { text: table.name },
        ];

        navigate("/order-details", {
          state: { order, title },
        });
      }}
    >
      <div className="flex flex-1 flex-col justify-between">
        <div className="text-sm font-semibold">{table.name}</div>
        <div className="flex items-center justify-between">
          {hasOrders && (
            <>
              <span className="text-xs">
                {table.orders.length}
                {table.orders[0].totalQuantity} món •{" "}
                {withThousandSeparators(table.orders[0].totalAmount)}
              </span>
              <div className="flex items-center space-x-0.5 text-xs">
                <FaFileLines />
                <p>{table.orders.length}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Tile>
  );
};

export { TableTile };
