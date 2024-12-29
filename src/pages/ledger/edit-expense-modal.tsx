import Button from "@/components/button";
import { userAtom } from "@/state";
import {
  LedgerAccount,
  LedgerAccountSubtype,
  LedgerAccountType,
} from "@/types/company";
import { PaymentType } from "@/types/payment";
import { useAtomValue } from "jotai";
import { Modal } from "zmp-ui";
import ExpenseForm from "./expense-form";
import { useEditExpenseModal } from "./local-state";

const EditExpenseModal = ({
  ledgerAccount,
}: {
  ledgerAccount: LedgerAccount;
}) => {
  const { isOpen, onClose } = useEditExpenseModal();
  const user = useAtomValue(userAtom);

  const onSubmit = async (values: {
    amount: string;
    note: string;
    paymentMethod: PaymentType;
    subType: LedgerAccountSubtype;
  }) => {
    if (!user) return;

    const body = {
      id: ledgerAccount.id,
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
    // TODO: Call API to update expense

    onClose();
  };

  return (
    <Modal
      maskClosable={false}
      title="Cập nhật phiếu chi"
      visible={isOpen}
      onClose={onClose}
    >
      <ExpenseForm
        isOpen={isOpen}
        onSubmit={onSubmit}
        initialValues={{
          amount: ledgerAccount.amount,
          note: ledgerAccount.note,
          paymentMethod: ledgerAccount.paymentMethod,
          subType: ledgerAccount.subType,
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

export default EditExpenseModal;
