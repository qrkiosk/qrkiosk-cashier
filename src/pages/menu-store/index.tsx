import Divider from "@/components/section-divider";
import { ChevronRight } from "@/components/vectors";

const MenuStorePage = () => {
  return (
    <div className="min-h-full bg-section">
      <div
        className="flex cursor-pointer items-center justify-between bg-background p-2"
        onClick={() => {}}
      >
        <span className="truncate p-2 text-sm font-medium">
          Lịch sử đơn hàng
        </span>
        <ChevronRight />
      </div>

      <Divider />

      <div
        className="flex cursor-pointer items-center justify-between bg-background p-2"
        onClick={() => {}}
      >
        <span className="truncate p-2 text-sm font-medium">Sản phẩm</span>
        <ChevronRight />
      </div>

      <Divider />

      <div
        className="flex cursor-pointer items-center justify-between bg-background p-2"
        onClick={() => {}}
      >
        <span className="truncate p-2 text-sm font-medium">Quản lý ca</span>
        <ChevronRight />
      </div>
    </div>
  );
};

export default MenuStorePage;
