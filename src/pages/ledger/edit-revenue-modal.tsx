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
import { useEditRevenueModal } from "./local-state";
import RevenueForm from "./revenue-form";

const EditRevenueModal = ({
  ledgerAccount,
}: {
  ledgerAccount: LedgerAccount;
}) => {
  const { isOpen, onClose } = useEditRevenueModal();
  const user = useAtomValue(userAtom);

  const onSubmit = (values: {
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
      type: LedgerAccountType.REVENUE,
      subType: values.subType,
      // paymentMethod: values.paymentMethod,
      note: values.note,
    };

    console.log(body);
    // TODO: Call API to update revenue

    onClose();
  };

  return (
    <Modal
      maskClosable={false}
      title="Cập nhật phiếu thu"
      visible={isOpen}
      onClose={onClose}
    >
      <RevenueForm
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

export default EditRevenueModal;
