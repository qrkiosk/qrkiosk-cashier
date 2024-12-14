import { draftOrderAtom } from "@/state";
import { BreadcrumbEntry } from "@/types/common";
import { useAtomValue } from "jotai";
import { FaAngleRight } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
  const order = useAtomValue(draftOrderAtom);
  const customerName = order?.customer?.name;

  return (
    <div
      className="cursor-pointer bg-[--zmp-background-white] p-4"
      onClick={() => {
        navigate("/choose-order-customer", {
          state: {
            title: [...breadcrumb, { text: "Khách hàng" }],
            isCreatingOrder: true,
          },
        });
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold">Khách hàng</span>
          {!!customerName && (
            <span className="text-sm text-inactive">{customerName}</span>
          )}
        </div>
        <FaAngleRight fontSize={16} color="rgb(109, 109, 109)" />
      </div>
    </div>
  );
};

export default Customer;
