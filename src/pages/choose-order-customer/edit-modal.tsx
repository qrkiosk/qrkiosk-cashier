import { updateCustomer as updateCustomerApi } from "@/api/customer";
import Button from "@/components/button";
import { use401ErrorFlag } from "@/hooks";
import { customersQueryAtom, tokenAtom } from "@/state";
import { Customer } from "@/types/customer";
import { withErrorStatusCodeHandler } from "@/utils/error";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Modal } from "zmp-ui";
import CustomerForm from "./form";
import { useEditModal } from "./local-state";

const useUpdateCustomerWith401Handler = () => {
  const { escalate: escalate401Error } = use401ErrorFlag();
  return withErrorStatusCodeHandler(updateCustomerApi, [
    { statusCode: 401, handler: escalate401Error },
  ]);
};

const EditCustomerModal = ({ customer }: { customer: Customer }) => {
  const { isOpen, onClose } = useEditModal();
  const token = useAtomValue(tokenAtom);
  const updateCustomer = useUpdateCustomerWith401Handler();
  const { refetch } = useAtomValue(customersQueryAtom);

  const onSubmit = async (values: { name: string; phoneNumber: string }) => {
    try {
      await updateCustomer(
        {
          id: customer.id,
          companyId: customer.companyId,
          storeId: customer.storeId,
          ...values,
        },
        token,
      );
      await refetch();
      onClose();
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  return (
    <Modal
      maskClosable={false}
      title="Cập nhật thông tin KH"
      visible={isOpen}
      onClose={onClose}
    >
      <CustomerForm
        isOpen={isOpen}
        onSubmit={onSubmit}
        initialValues={{
          name: customer.name,
          phoneNumber: customer.phoneNumber,
        }}
        secondaryAction={
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        }
      />
    </Modal>
  );
};

export default EditCustomerModal;
