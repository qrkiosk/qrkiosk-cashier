import Button from "@/components/button";
import { useDeviceMode } from "@/hooks";
import { currentOrderIdAtom, currentTableAtom } from "@/state";
import { BreadcrumbEntry } from "@/types/common";
import { Table } from "@/types/company";
import { withThousandSeparators } from "@/utils/number";
import { useDisclosure } from "@chakra-ui/react";
import classNames from "classnames";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { FaBagShopping, FaFileLines, FaTruckFast } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Modal } from "zmp-ui";

type TileProps = {
  children: React.ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
};

const BaseTile = ({ children, highlighted = false, onClick }: TileProps) => {
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

const Tile = {} as {
  Takeaway: React.FC<{ table: Table }>;
  Delivery: React.FC<{ table: Table }>;
  OnSite: React.FC<{ table: Table }>;
};

Tile.Takeaway = ({ table }) => {
  return (
    <BaseTile highlighted={!isEmpty(table.orders)}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center space-x-1">
          <FaBagShopping />
          <div className="text-sm font-semibold">{table.name}</div>
        </div>
        <div className="flex-1" />
      </div>
    </BaseTile>
  );
};

Tile.Delivery = ({ table }) => {
  return (
    <BaseTile highlighted={!isEmpty(table.orders)}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center space-x-1">
          <FaTruckFast />
          <div className="text-sm font-semibold">{table.name}</div>
        </div>
        <div className="flex-1" />
      </div>
    </BaseTile>
  );
};

Tile.OnSite = ({ table }) => {
  const navigate = useNavigate();
  const device = useDeviceMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setCurrentTable = useSetAtom(currentTableAtom);
  const setCurrentOrderId = useSetAtom(currentOrderIdAtom);
  const hasOrders = !isEmpty(table.orders);

  const navigateToOrderCreate = () => {
    const title: BreadcrumbEntry[] = [
      { text: table.zoneName },
      { text: `${table.name} (Đơn mới)` },
    ];
    setCurrentTable(table);
    setCurrentOrderId(null);
    navigate(device === "tablet" ? "/order-create-pos" : "/order-create", {
      state: { title },
    });
  };

  const navigateToOrderDetails = (orderId: string) => {
    const title: BreadcrumbEntry[] = [
      { text: table.zoneName },
      { text: table.name },
    ];
    setCurrentTable(table);
    setCurrentOrderId(orderId);
    navigate(device === "tablet" ? "/order-details-pos" : "/order-details", {
      state: { title },
    });
  };

  return (
    <>
      <BaseTile
        highlighted={hasOrders}
        onClick={() => {
          if (isEmpty(table.orders)) {
            navigateToOrderCreate(); // empty table, create new order
          } else if (table.orders.length === 1) {
            navigateToOrderDetails(table.orders[0].id); // table with 1 order, jump to that order
          } else {
            onOpen(); // table with multiple orders, open modal to choose one
          }
        }}
      >
        <div className="flex flex-1 flex-col justify-between">
          <div className="text-sm font-semibold">{table.name}</div>
          <div className="flex items-center justify-between">
            {hasOrders && (
              <>
                <span className="text-xs">
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
      </BaseTile>

      <Modal title={`Bàn ${table.name}`} visible={isOpen} onClose={onClose}>
        <div className="space-y-4">
          <p className="text-sm">Chọn đơn hàng để xử lý:</p>

          <div className="space-y-3">
            {table.orders.map((order) => (
              <div
                key={order.id}
                className="flex cursor-pointer rounded-lg bg-[--zmp-background-color] p-3"
                onClick={() => navigateToOrderDetails(order.id)}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    Khách: {order.customerName}
                  </p>
                  <p className="text-sm text-subtitle">
                    {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {withThousandSeparators(order.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={navigateToOrderCreate}
            >
              Tạo đơn mới
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Tile;
