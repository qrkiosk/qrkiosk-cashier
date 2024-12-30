import { createLedgerAccount as createLedgerAccountApi } from "@/api/company";
import Button from "@/components/button";
import { useAuthorizedApi } from "@/hooks";
import { tokenAtom, userAtom } from "@/state";
import { ledgerBookQueryAtom } from "@/state/company";
import {
  LedgerAccountReqBody,
  LedgerAccountSubtype,
  LedgerAccountType,
} from "@/types/company";
import { PaymentType } from "@/types/payment";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { Modal } from "zmp-ui";
import { useAddRevenueModal } from "./local-state";
import RevenueForm from "./revenue-form";

const AddRevenueModal = () => {
  const { isOpen, onClose } = useAddRevenueModal();
  const createLedgerAccount = useAuthorizedApi(createLedgerAccountApi);
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

    try {
      await createLedgerAccount(body, token);
      await refetchLedgerBook();
      toast.success("Tạo phiếu thu thành công.");
      onClose();
    } catch {
      toast.error("Xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    }
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
