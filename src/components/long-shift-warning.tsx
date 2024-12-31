import { currentShiftAtom } from "@/state";
import { useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "zmp-ui";

function isPastDate(dateString: string | undefined) {
  const givenDate = dayjs(dateString);
  const today = dayjs().startOf("day");
  return givenDate.isBefore(today);
}

const LongShiftWarning = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentShift = useAtomValue(currentShiftAtom);

  useEffect(() => {
    if (currentShift != null && isPastDate(currentShift.beginDate)) {
      onOpen();
    }
  }, [currentShift]);

  return (
    <Modal
      visible={isOpen}
      onClose={onClose}
      title="Lưu ý"
      description="Ca làm việc đã qua ngày. Bạn có muốn đóng ca làm việc cũ?"
      actions={[
        {
          text: "Không",
          close: true,
        },
        {
          text: "Xem và đóng ca",
          highLight: true,
          onClick: () => {
            navigate("/manage-shift");
            onClose();
          },
        },
      ]}
    />
  );
};

export default LongShiftWarning;
