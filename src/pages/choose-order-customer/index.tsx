import { updateOrder as updateOrderApi } from "@/api/order";
import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import { use401ErrorFlag } from "@/hooks";
import { currentOrderAtom, currentOrderQueryAtom, tokenAtom } from "@/state";
import { customersQueryAtom } from "@/state/customer";
import { Customer } from "@/types/customer";
import { withErrorStatusCodeHandler } from "@/utils/error";
import { genOrderReqBody } from "@/utils/order";
import { useAtomValue } from "jotai";
import isEmpty from "lodash/isEmpty";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { FaMagnifyingGlass, FaPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Spinner } from "zmp-ui";
import AddCustomerModal from "./add-modal";
import EditCustomerModal from "./edit-modal";
import { useEditModal } from "./local-state";

const useUpdateOrderWith401Handler = () => {
  const { escalate: escalate401Error } = use401ErrorFlag();
  return withErrorStatusCodeHandler(updateOrderApi, [
    { statusCode: 401, handler: escalate401Error },
  ]);
};

const ChooseOrderCustomer = () => {
  const navigate = useNavigate();
  const { onOpen } = useEditModal();
  const [customer, setCustomer] = useState<Customer | null>(null);

  const token = useAtomValue(tokenAtom);
  const order = useAtomValue(currentOrderAtom);

  const { refetch: refetchOrder } = useAtomValue(currentOrderQueryAtom);
  const {
    data: customers,
    isLoading,
    error,
    refetch: refetchCustomers,
  } = useAtomValue(customersQueryAtom);

  const updateOrder = useUpdateOrderWith401Handler();

  if (isLoading) {
    return (
      <FlexDiv row center>
        <Spinner />
      </FlexDiv>
    );
  }

  if (error) {
    return (
      <FlexDiv col center className="space-y-4">
        <p className="text-sm text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await refetchCustomers();
            } catch {
              toast.error("Xảy ra lỗi khi tải dữ liệu.");
            }
          }}
        >
          Tải lại
        </Button>
      </FlexDiv>
    );
  }

  if (isEmpty(customers)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

  return (
    <FlexDiv col className="bg-[--zmp-background-white] !p-0">
      <div className="px-4 pb-2 pt-4">
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
        {customers.map((customer) => (
          <Fragment key={customer.id}>
            <div className="flex items-center justify-between pr-3">
              <div
                className="flex flex-1 cursor-pointer space-x-3 py-4 pl-6"
                onClick={async () => {
                  if (!order) return;

                  try {
                    await updateOrder(
                      genOrderReqBody(order, {
                        customer: {
                          id: customer.id,
                          name: customer.name,
                        },
                      }),
                      token,
                    );
                    refetchOrder();
                    navigate(-1);
                  } catch {
                    toast.error(
                      "Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
                    );
                  }
                }}
              >
                <span className="text-sm font-medium">{customer.name}</span>
                {customer.phoneNumber && (
                  <span className="text-sm text-inactive">
                    {customer.phoneNumber}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="text"
                onClick={() => {
                  setCustomer(customer);
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
