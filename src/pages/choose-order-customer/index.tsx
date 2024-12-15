import { updateOrder as updateOrderApi } from "@/api/order";
import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import { use401ErrorFlag } from "@/hooks";
import {
  currentOrderAtom,
  currentOrderQueryAtom,
  draftOrderAtom,
  tokenAtom,
} from "@/state";
import {
  customersQueryAtom,
  searchCustomerQueryAtom,
  searchCustomerResultsAtom,
} from "@/state/customer";
import { Customer } from "@/types/customer";
import { withErrorStatusCodeHandler } from "@/utils/error";
import { genOrderReqBody } from "@/utils/order";
import { useAtomValue, useSetAtom } from "jotai";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaMagnifyingGlass, FaPenToSquare } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
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

const useDebouncedCustomerSearch = () => {
  const [input, setInput] = useState("");
  const setSearchQuery = useSetAtom(searchCustomerQueryAtom);
  const setSearchQueryDebounced = useMemo(
    () => debounce(setSearchQuery, 500),
    [],
  );

  useEffect(() => {
    setSearchQueryDebounced(input.trim());
  }, [input]);

  return [input, setInput] as const;
};

const ChooseOrderCustomer = () => {
  const location = useLocation();
  const isCreatingOrder = location.state?.isCreatingOrder === true;
  const navigate = useNavigate();
  const { onOpen } = useEditModal();
  const [customer, setCustomer] = useState<Customer | null>(null);

  const token = useAtomValue(tokenAtom);
  const existingOrder = useAtomValue(currentOrderAtom);
  const updateOrder = useUpdateOrderWith401Handler();
  const { refetch: refetchOrder } = useAtomValue(currentOrderQueryAtom);
  const setDraftOrder = useSetAtom(draftOrderAtom);

  const {
    data,
    isLoading,
    error,
    refetch: refetchCustomers,
  } = useAtomValue(customersQueryAtom);
  const searchResults = useAtomValue(searchCustomerResultsAtom);
  const [input, setInput] = useDebouncedCustomerSearch();

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

  if (isEmpty(data)) {
    return (
      <FlexDiv row center>
        <p className="text-sm text-subtitle">Không có dữ liệu.</p>
      </FlexDiv>
    );
  }

  return (
    <FlexDiv col className="!p-0">
      <div className="bg-[--zmp-background-white] p-4">
        <div className="relative w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc SĐT"
            className="h-10 w-full rounded-lg bg-section pl-4 pr-3 text-lg normal-case outline-none placeholder:text-sm placeholder:text-inactive"
          />
          <FaMagnifyingGlass
            fontSize={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-inactive"
          />
        </div>
      </div>

      {isEmpty(searchResults) ? (
        <p className="py-6 text-center text-sm text-subtitle">
          Không tìm thấy khách hàng.
        </p>
      ) : (
        <div className="bg-[--zmp-background-white]">
          {searchResults.map((customer) => (
            <Fragment key={customer.id}>
              <div className="flex items-center justify-between pr-3">
                <div
                  className="flex flex-1 cursor-pointer space-x-3 py-4 pl-6"
                  onClick={async () => {
                    if (isCreatingOrder) {
                      setDraftOrder((prev) => ({
                        ...prev,
                        customer: {
                          id: customer.id,
                          name: customer.name,
                        },
                      }));
                      navigate(-1);
                    } else if (existingOrder) {
                      try {
                        await updateOrder(
                          genOrderReqBody(existingOrder, {
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
      )}

      <AddCustomerModal />
      {customer != null && <EditCustomerModal customer={customer} />}
    </FlexDiv>
  );
};

export default ChooseOrderCustomer;
