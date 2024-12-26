import Button from "@/components/button";
import autosize from "autosize";
import { useEffect, useRef, useState } from "react";
import { Modal } from "zmp-ui";
import IncomeForm from "./income-form";

const AddIncomeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    autosize(ref.current);
    return () => {
      autosize.destroy(ref.current);
    };
  }, []);

  return (
    <Modal
      maskClosable={false}
      title="Tạo phiếu thu"
      visible={isOpen}
      onClose={onClose}
    >
      <IncomeForm
        onSubmit={(values) => {}}
        secondaryAction={
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        }
      />
    </Modal>
  );
};

export default AddIncomeModal;
