import { updateLedgerAccount as updateLedgerAccountApi } from "@/api/company";
import Button from "@/components/button";
import { useAuthorizedApi } from "@/hooks";
import { tokenAtom, userAtom } from "@/state";
import { ledgerBookQueryAtom } from "@/state/company";
import {
  LedgerAccount,
  LedgerAccountReqBody,
  LedgerAccountSubtype,
  LedgerAccountType,
} from "@/types/company";
import { PaymentType } from "@/types/payment";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Modal } from "zmp-ui";
import ExpenseForm from "./expense-form";
import { useEditExpenseModal } from "./local-state";

const EditExpenseModal = ({
  ledgerAccount,
}: {
  ledgerAccount: LedgerAccount;
}) => {
  const { isOpen, onClose } = useEditExpenseModal();
  const updateLedgerAccount = useAuthorizedApi(updateLedgerAccountApi);
  const { refetch: refetchLedgerBook } = useAtomValue(ledgerBookQueryAtom);
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);

  const onSubmit = async (values: {
    amount: string;
    note: string;
    paymentMethod: PaymentType;
    subType: LedgerAccountSubtype;
  }) => {
    if (!user) return;

    const body: LedgerAccountReqBody = {
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

    try {
      await updateLedgerAccount(body, token);
      await refetchLedgerBook();
      toast.success("Cập nhật phiếu chi thành công.");
      onClose();
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
  };

  return (
    <Modal
      maskClosable={false}
      title="Cập nhật phiếu chi"
      visible={isOpen}
      onClose={onClose}
    >
      <ExpenseForm
        isEdit
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
