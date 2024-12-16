import { updateCustomer as updateCustomerApi } from "@/api/customer";
import Button from "@/components/button";
import { useAuthorizedApi } from "@/hooks";
import { tokenAtom } from "@/state";
import { customersQueryAtom } from "@/state/customer";
import { Customer } from "@/types/customer";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Modal } from "zmp-ui";
import CustomerForm from "./form";
import { useEditModal } from "./local-state";

const EditCustomerModal = ({ customer }: { customer: Customer }) => {
  const { isOpen, onClose } = useEditModal();
  const token = useAtomValue(tokenAtom);
  const updateCustomer = useAuthorizedApi(updateCustomerApi);
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
