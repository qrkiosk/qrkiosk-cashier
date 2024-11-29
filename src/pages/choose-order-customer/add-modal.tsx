import Button from "@/components/button";
import FloatingButton from "@/components/floating-button";
import { Modal } from "zmp-ui";
import CustomerForm from "./form";
import { useAddModal } from "./local-state";

const AddCustomerModal = () => {
  const { isOpen, onOpen, onClose } = useAddModal();
  const onSubmit = async (values) => {
    // try {
    //   const authResult = await authenticate(values);
    //   setAuthResult(authResult.data.data);
    //   navigate("/menu-table", { replace: true });
    // } catch (error) {
    //   console.log(error);
    //   if ((error as AxiosError).status === 401) {
    //     toast.error(
    //       "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra và thử lại.",
    //     );
    //   } else {
    //     toast.error("Xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
    //   }
    // }
    onClose();
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
