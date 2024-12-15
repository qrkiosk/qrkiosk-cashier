import Button from "@/components/button";
import { useFocusedInputRef } from "@/hooks";
import { draftOrderAtom } from "@/state";
import { useDisclosure } from "@chakra-ui/react";
import autosize from "autosize";
import { useAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Modal } from "zmp-ui";

const OrderNote = () => {
  const { isOpen, onOpen, onClose: off } = useDisclosure();
  const ref = useFocusedInputRef<HTMLTextAreaElement>(isOpen);
  const [input, setInput] = useState("");
  const [order, setOrder] = useAtom(draftOrderAtom);
  const orderNote = order?.note ?? "";

  const onClose = useCallback(() => {
    setInput("");
    off();
  }, []);

  const onSubmit = async () => {
    setOrder((prev) => ({ ...prev, note: input.trim() }));
    off();
  };

  useEffect(() => {
    autosize(ref.current);
    return () => {
      autosize.destroy(ref.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen && !isEmpty(orderNote)) setInput(orderNote);
  }, [isOpen]);

  return (
    <>
      <div
        className="cursor-pointer bg-[--zmp-background-white] p-4"
        onClick={onOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-semibold">Ghi chú đơn</span>
            <span className="text-sm text-inactive">{orderNote}</span>
          </div>
          <FaAngleRight fontSize={16} color="rgb(109, 109, 109)" />
        </div>
      </div>

      <Modal maskClosable={false} title="Thêm ghi chú đơn" visible={isOpen}>
        <div className="space-y-4">
          <textarea
            ref={ref}
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-lg bg-section p-4 text-sm normal-case outline-none placeholder:text-inactive"
            style={{ transition: "height none" }}
            placeholder="Nhập ghi chú cho bếp"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrderNote;
