import {
  checkIsShiftOpen as checkIsShiftOpenApi,
  createShift as createShiftApi,
} from "@/api/company";
import { useAuthorizedApi, useOpenShiftModal } from "@/hooks";
import {
  companyIdAtom,
  currentShiftAtom,
  storeIdAtom,
  tokenAtom,
  userAtom,
} from "@/state";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

const OpenShiftModal = () => {
  const toast = useToast();
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const { isOpen, onOpen, onClose } = useOpenShiftModal();
  const createShift = useAuthorizedApi(createShiftApi);
  const checkIsShiftOpen = useAuthorizedApi(checkIsShiftOpenApi);
  const user = useAtomValue(userAtom)!;
  const token = useAtomValue(tokenAtom);
  const companyId = useAtomValue(companyIdAtom);
  const storeId = useAtomValue(storeIdAtom);
  const setCurrentShift = useSetAtom(currentShiftAtom);

  useEffect(() => {
    if (!token || !companyId || !storeId) return;

    checkIsShiftOpen({ companyId, storeId }, token).then((res) => {
      const shift = res.data.data;
      if (shift == null) {
        onOpen();
      } else {
        setCurrentShift(shift);
      }
    });
  }, [token, companyId, storeId]);

  return (
    <Modal
      size="xs"
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mở ca làm việc</ModalHeader>

        <ModalBody>
          <Grid templateColumns="repeat(3, 1fr)" rowGap={2}>
            <GridItem colSpan={1}>
              <Box h="100%" display="flex" alignItems="center">
                <Text>Nhân viên:</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box h="100%" display="flex" alignItems="center">
                <Text>{user?.name ?? ""}</Text>
              </Box>
            </GridItem>

            <GridItem colSpan={1}>
              <Box h="100%" display="flex" alignItems="center">
                <Text>Thời gian:</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box h="100%" display="flex" alignItems="center">
                <Text>{dayjs().format("HH:mm DD/MM/YYYY")}</Text>
              </Box>
            </GridItem>

            <GridItem colSpan={1}>
              <Box
                h="100%"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Text>Tiền đầu ca:</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box
                h="100%"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Input
                  autoFocus
                  placeholder="Nhập số tiền"
                  type="number"
                  borderRadius="md"
                  size="sm"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </Box>
            </GridItem>

            <GridItem colSpan={1}>
              <Box
                h="100%"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Text>Ghi chú:</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box
                h="100%"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Input
                  placeholder="Nhập ghi chú"
                  borderRadius="md"
                  size="sm"
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                />
              </Box>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              try {
                await createShift(
                  {
                    companyId: user?.companyId,
                    storeId: user?.storeId,
                    employeeId: user?.employeeId,
                    employeeName: user?.name,
                    beginAmount: parseInt(amount) ?? 0,
                    endAmount: 0,
                    note,
                  },
                  token,
                );

                toast({
                  title: "Mở ca làm việc thành công.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                onClose();
              } catch {
                toast({
                  title:
                    "Không thể mở ca làm việc. Xảy ra lỗi trong quá trình xử lý.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              }
            }}
          >
            Mở ca
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OpenShiftModal;
