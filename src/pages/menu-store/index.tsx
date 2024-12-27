import HorizontalDivider from "@/components/horizontal-divider";
import Divider from "@/components/section-divider";
import { ChevronRight } from "@/components/vectors";
import { useNavigate } from "react-router-dom";

const MenuStorePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-section">
      <Divider />

      <div
        className="flex cursor-pointer items-center justify-between bg-background p-2"
        onClick={() => navigate("/order-history")}
      >
        <span className="truncate p-2 text-sm font-medium">
          Lịch sử đơn hàng
        </span>
        <ChevronRight />
      </div>

      <HorizontalDivider />

      <div
        className="flex cursor-pointer items-center justify-between bg-background p-2"
        onClick={() => navigate("/configure-products")}
      >
        <span className="truncate p-2 text-sm font-medium">Sản phẩm</span>
        <ChevronRight />
      </div>

      <HorizontalDivider />

      <div
        className="flex cursor-pointer items-center justify-between bg-background p-2"
        onClick={() => navigate("/manage-shift")}
      >
        <span className="truncate p-2 text-sm font-medium">Quản lý ca</span>
        <ChevronRight />
      </div>
    </div>
  );
};

export default MenuStorePage;
