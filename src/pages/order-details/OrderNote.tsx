import {
  Box,
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";

import { APP_ACCENT_COLOR } from "../../utils/constants";

const OrderNote = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const onSubmit = () => {
    console.log(input);
    onClose();
  };

  return (
    <>
      <Box
        p={4}
        bgColor="var(--zmp-background-white)"
        cursor="pointer"
        onClick={onOpen}
      >
        <Box
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size="sm">Ghi chú đơn</Heading>
          <FaPenToSquare fontSize={20} color="rgb(109, 109, 109)" />
        </Box>
      </Box>

      <Modal
        isCentered
        closeOnOverlayClick={false}
        size={{ base: "xs", sm: "sm" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm ghi chú đơn</ModalHeader>

          <ModalBody py={0}>
            <Input
              autoFocus
              placeholder="Nhập ghi chú"
              borderRadius="md"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </ModalBody>

          <ModalFooter className="space-x-2">
            <Button onClick={onClose}>Hủy</Button>
            <Button colorScheme={APP_ACCENT_COLOR} onClick={onSubmit}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrderNote;
