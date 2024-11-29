import Button from "@/components/button";
import { Customer } from "@/types/customer";
import { Modal } from "zmp-ui";
import CustomerForm from "./form";
import { useEditModal } from "./local-state";

const EditCustomerModal = ({ customer }: { customer: Customer }) => {
  const { isOpen, onClose } = useEditModal();
  const onSubmit = async (values) => {
    // call API asynchronously here;
    onClose(); // close modal after all
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
        initialValues={{ name: customer.name, phone: customer.phone }}
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
