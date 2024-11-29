import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import { Customer } from "@/types/customer";
import { Fragment, useState } from "react";
import { FaMagnifyingGlass, FaPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AddCustomerModal from "./add-modal";
import EditCustomerModal from "./edit-modal";
import { useEditModal } from "./local-state";

const CUSTOMERS: Customer[] = [
  { id: 1, name: "Lê Thị B", phone: "0123456789" },
  { id: 2, name: "Trần Văn C", phone: "0123456789" },
];

const ChooseOrderCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { onOpen } = useEditModal();

  return (
    <FlexDiv col className="bg-[--zmp-background-white] !p-0">
      <div className="p-4">
        <div className="relative w-full">
          <input
            placeholder="Tìm kiếm theo tên hoặc SĐT"
            className="h-10 w-full rounded-lg bg-section pl-4 pr-3 text-lg normal-case outline-none placeholder:text-sm placeholder:text-inactive"
          />
          <FaMagnifyingGlass
            fontSize={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-inactive"
          />
        </div>
      </div>

      <div>
        {CUSTOMERS.map((item) => (
          <Fragment key={item.id}>
            <div className="flex cursor-pointer items-center justify-between pr-3">
              <div
                className="flex flex-1 space-x-3 py-4 pl-6"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-inactive">{item.phone}</span>
              </div>
              <Button
                size="sm"
                variant="text"
                onClick={() => {
                  setCustomer(item);
                  onOpen();
                }}
              >
                <FaPenToSquare className="text-subtitle" fontSize={16} />
              </Button>
            </div>
            <HorizontalDivider />
          </Fragment>
        ))}
      </div>

      <AddCustomerModal />
      {customer != null && <EditCustomerModal customer={customer} />}
    </FlexDiv>
  );
};

export default ChooseOrderCustomer;
