import Button from "@/components/button";
import { Price } from "@/components/prices";
import {
  Box,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCalendar, FaChair, FaClock } from "react-icons/fa6";

const CompleteOrder = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const onSubmit = () => {
    console.log(input);
    onClose();
  };

  return (
    <>
      <Button variant="primary" onClick={onOpen} className="!px-4">
        Thanh toán
      </Button>

      <Modal
        isCentered
        closeOnOverlayClick={false}
        size={{ base: "sm", sm: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thanh toán</ModalHeader>

          <ModalBody p={0}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={6}
            >
              <Box display="flex" alignItems="center" className="space-x-1">
                <FaChair />
                <Text fontSize="sm" fontWeight="semibold">
                  Tầng trệt, Bàn số 1
                </Text>
              </Box>
              <Box display="flex" alignItems="center" className="space-x-1">
                <Box display="flex" alignItems="center" className="space-x-1">
                  <FaCalendar />
                  <Text fontSize="sm" fontWeight="semibold">
                    08/11/2024
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" className="space-x-1">
                  <FaClock />
                  <Text fontSize="sm" fontWeight="semibold">
                    10:11
                  </Text>
                </Box>
              </Box>
            </Box>

            <Grid templateColumns="repeat(2, 1fr)" rowGap={2} px={6} py={3}>
              <GridItem colSpan={1}>
                <Box h="100%" display="flex" alignItems="center">
                  <Text fontSize="sm">Tổng tiền hàng</Text>
                </Box>
              </GridItem>
              <GridItem colSpan={1}>
                <Box
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Price variant="standard">{90000}</Price>
                </Box>
              </GridItem>

              <GridItem colSpan={1}>
                <Box h="100%" display="flex" alignItems="center">
                  <Text fontSize="sm">Giảm giá</Text>
                </Box>
              </GridItem>
              <GridItem colSpan={1}>
                <Box
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Price variant="standard">{10000}</Price>
                </Box>
              </GridItem>

              <GridItem colSpan={1}>
                <Box h="100%" display="flex" alignItems="center">
                  <Text fontSize="sm">Phí dịch vụ</Text>
                </Box>
              </GridItem>
              <GridItem colSpan={1}>
                <Box
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Price variant="standard">{5000}</Price>
                </Box>
              </GridItem>

              <GridItem colSpan={1}>
                <Box h="100%" display="flex" alignItems="center">
                  <Text fontSize="sm" fontWeight="bold">
                    Khách cần trả
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={1}>
                <Box
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Price variant="total">{65000}</Price>
                </Box>
              </GridItem>
            </Grid>

            <Box bgColor="var(--zmp-background-color)">
              <Text fontSize="xs" color="GrayText" px={6} pt={3} pb={1}>
                PHƯƠNG THỨC THANH TOÁN
              </Text>
            </Box>

            <RadioGroup defaultValue="pm1" px={6} py={2} size="sm">
              <Stack direction="column" spacing={1}>
                <Radio value="pm1">Tiền mặt</Radio>
                <Radio value="pm2">Thẻ</Radio>
                <Radio value="pm3">Chuyển khoản</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Thanh toán
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompleteOrder;
