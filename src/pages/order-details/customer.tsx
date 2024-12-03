import { currentOrderAtom } from "@/state";
import { BreadcrumbEntry } from "@/types/common";
import { useAtomValue } from "jotai";
import { FaAngleRight } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
  const order = useAtomValue(currentOrderAtom);

  return (
    <div
      className="cursor-pointer bg-[--zmp-background-white] p-4"
      onClick={() =>
        navigate("/choose-order-customer", {
          state: {
            title: [...breadcrumb, { text: "Khách hàng" }],
          },
        })
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold">Khách hàng</span>
          <span className="text-inactive">{order?.customerName}</span>
        </div>
        <FaAngleRight fontSize={16} color="rgb(109, 109, 109)" />
      </div>
    </div>
  );
};

export default Customer;
