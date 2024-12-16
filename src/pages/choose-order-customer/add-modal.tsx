import { createCustomer as createCustomerApi } from "@/api/customer";
import Button from "@/components/button";
import FloatingButton from "@/components/floating-button";
import { useAuthorizedApi } from "@/hooks";
import { currentOrderAtom, tokenAtom } from "@/state";
import { customersQueryAtom } from "@/state/customer";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Modal } from "zmp-ui";
import CustomerForm from "./form";
import { useAddModal } from "./local-state";

const AddCustomerModal = () => {
  const { isOpen, onOpen, onClose } = useAddModal();
  const order = useAtomValue(currentOrderAtom);
  const token = useAtomValue(tokenAtom);
  const createCustomer = useAuthorizedApi(createCustomerApi);
  const { refetch } = useAtomValue(customersQueryAtom);

  const onSubmit = async (values: { name: string; phoneNumber: string }) => {
    if (!order) return;

    try {
      await createCustomer(
        {
          companyId: order.companyId,
          storeId: order.storeId,
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
    <>
      <FloatingButton
        className="bottom-8 right-5 bg-gray-700 hover:bg-gray-800"
        onClick={onOpen}
      />
      <Modal
        maskClosable={false}
        title="Thêm khách hàng"
        visible={isOpen}
        onClose={onClose}
      >
        <CustomerForm
          isOpen={isOpen}
          onSubmit={onSubmit}
          secondaryAction={
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
          }
        />
      </Modal>
    </>
  );
};

export default AddCustomerModal;
