import Button from "@/components/button";
import { userAtom } from "@/state";
import { LedgerAccountSubtype, LedgerAccountType } from "@/types/company";
import { PaymentType } from "@/types/payment";
import { useAtomValue } from "jotai";
import { Modal } from "zmp-ui";
import RevenueForm from "./revenue-form";

const AddRevenueModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const user = useAtomValue(userAtom);

  const onSubmit = (values: {
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
      type: LedgerAccountType.REVENUE,
      subType: values.subType,
      paymentMethod: values.paymentMethod,
      note: values.note,
    };

    console.log(body);
    // TODO: Call API to create revenue

    onClose();
  };

  return (
    <Modal
      maskClosable={false}
      title="Tạo phiếu thu"
      visible={isOpen}
      onClose={onClose}
    >
      <RevenueForm
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

export default AddRevenueModal;
