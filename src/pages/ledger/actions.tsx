import FloatingButton from "@/components/floating-button";
import { useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { Sheet } from "zmp-ui";
import AddExpenseModal from "./add-expense-modal";
import AddRevenueModal from "./add-revenue-modal";
import EditExpenseModal from "./edit-expense-modal";
import EditRevenueModal from "./edit-revenue-modal";
import {
  selectedLedgerAccountAtom,
  useAddExpenseModal,
  useAddRevenueModal,
} from "./local-state";

const Actions = () => {
  const selectedLedgerAccount = useAtomValue(selectedLedgerAccountAtom);
  const { onOpen: onOpenAddRevenueModal } = useAddRevenueModal();
  const { onOpen: onOpenAddExpenseModal } = useAddExpenseModal();
  const {
    isOpen: isActionsSheetOpen,
    onOpen: onOpenActionsSheet,
    onClose: onCloseActionsSheet,
  } = useDisclosure();

  return (
    <>
      <FloatingButton
        className="bottom-24 right-4 bg-gray-700 hover:bg-gray-800"
        onClick={onOpenActionsSheet}
      />
      <Sheet.Actions
        visible={isActionsSheetOpen}
        onClose={onCloseActionsSheet}
        swipeToClose={false}
        actions={[
          [
            {
              text: "Tạo phiếu thu",
              close: true,
              onClick: onOpenAddRevenueModal,
            },
            {
              text: "Tạo phiếu chi",
              close: true,
              onClick: onOpenAddExpenseModal,
            },
          ],
          [{ text: "Hủy", close: true }],
        ]}
      />
      <AddRevenueModal />
      <AddExpenseModal />
      {selectedLedgerAccount != null && (
        <>
          <EditRevenueModal ledgerAccount={selectedLedgerAccount} />
          <EditExpenseModal ledgerAccount={selectedLedgerAccount} />
        </>
      )}
    </>
  );
};

export default Actions;
