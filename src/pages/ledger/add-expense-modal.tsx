import Button from "@/components/button";
import { userAtom } from "@/state";
import { LedgerAccountSubtype, LedgerAccountType } from "@/types/company";
import { PaymentType } from "@/types/payment";
import { useAtomValue } from "jotai";
import { Modal } from "zmp-ui";
import ExpenseForm from "./expense-form";
import { useAddExpenseModal } from "./local-state";

const AddExpenseModal = () => {
  const { isOpen, onClose } = useAddExpenseModal();
  const user = useAtomValue(userAtom);

  const onSubmit = async (values: {
    amount: string;
    note: string;
    paymentMethod: PaymentType;
    subType: LedgerAccountSubtype;
  }) => {
    if (!user) return;

    const body = {
      companyId: user.companyId,
      storeId: user.storeId,
      employeeId: user.employeeId,
      employeeName: user.name,
      amount: parseInt(values.amount),
      type: LedgerAccountType.EXPENSE,
      subType: values.subType,
      paymentMethod: values.paymentMethod,
      note: values.note,
    };

    console.log(body);
    // TODO: Call API to create expense

    onClose();
  };

  return (
    <Modal
      maskClosable={false}
      title="Tạo phiếu chi"
      visible={isOpen}
      onClose={onClose}
    >
      <ExpenseForm
        isOpen={isOpen}
        onSubmit={onSubmit}
        secondaryAction={
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        }
      />
    </Modal>
  );
};

export default AddExpenseModal;