import { draftOrderAtom } from "@/state";
import { defaultCustomerAtom } from "@/state/customer";
import { BreadcrumbEntry } from "@/types/common";
import { useAtom, useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const Customer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = location.state?.title as BreadcrumbEntry[];
  const defaultCustomer = useAtomValue(defaultCustomerAtom);
  const [draftOrder, setDraftOrder] = useAtom(draftOrderAtom);
  const customerName = draftOrder.customer?.name;

  // Set default customer for new order
  useEffect(() => {
    if (!isEmpty(draftOrder.customer) || !defaultCustomer) return;

    setDraftOrder((prev) => ({
      ...prev,
      customer: {
        id: defaultCustomer.id,
        name: defaultCustomer.name,
      },
    }));
  }, [defaultCustomer]);

  return (
    <div
      className="cursor-pointer bg-white p-4"
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
          <span className="text-sm text-inactive">
            {customerName ?? "Khách lẻ"}
          </span>
        </div>
        <FaAngleRight fontSize={16} color="rgb(109, 109, 109)" />
      </div>
    </div>
  );
};

export default Customer;
