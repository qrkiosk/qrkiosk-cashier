import FloatingButton from "@/components/floating-button";
import { useDisclosure } from "@chakra-ui/react";
import { Sheet } from "zmp-ui";
import AddIncomeModal from "./add-income-modal";

const Actions = () => {
  const {
    isOpen: isActionsSheetOpen,
    onOpen: onOpenActionsSheet,
    onClose: onCloseActionsSheet,
  } = useDisclosure();
  const {
    isOpen: isIncomeModalOpen,
    onOpen: onOpenIncomeModal,
    onClose: onCloseIncomeModal,
  } = useDisclosure();
  const {
    isOpen: isExpenseModalOpen,
    onOpen: onOpenExpenseModal,
    onClose: onCloseExpenseModal,
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
            { text: "Tạo phiếu thu", close: true, onClick: onOpenIncomeModal },
            { text: "Tạo phiếu chi", close: true, onClick: onOpenExpenseModal },
          ],
          [{ text: "Hủy", close: true }],
        ]}
      />
      <AddIncomeModal isOpen={isIncomeModalOpen} onClose={onCloseIncomeModal} />
    </>
  );
};

export default Actions;
