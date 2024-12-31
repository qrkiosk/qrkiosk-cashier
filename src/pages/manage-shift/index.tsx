import Button from "@/components/button";
import EmptyState from "@/components/empty-state";
import FlexDiv from "@/components/flex-div";
import Divider from "@/components/section-divider";
import { useStartShiftModal } from "@/hooks";
import { currentShiftAtom } from "@/state";
import { ledgerBookQueryAtom } from "@/state/company";
import { ordersQueryAtom } from "@/state/order";
import { withThousandSeparators } from "@/utils/number";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import Collapse from "./collapse";
import EndShiftForm from "./end-shift-form";
import Line from "./line";

const ManageShiftPage = () => {
  const shift = useAtomValue(currentShiftAtom);
  const { onOpen } = useStartShiftModal();
  const { refetch: refetchOrders } = useAtomValue(ordersQueryAtom);
  const { refetch: refetchLedgerBook } = useAtomValue(ledgerBookQueryAtom);

  useEffect(() => {
    refetchOrders();
    refetchLedgerBook();
  }, []);

  if (!shift) {
    return (
      <FlexDiv col className="!p-0">
        <EmptyState message="Hiện chưa mở ca làm việc." />
        <div className="flex justify-center space-x-3 p-2">
          <Button variant="primary" onClick={onOpen}>
            Mở ca
          </Button>
        </div>
      </FlexDiv>
    );
  }

  return (
    <FlexDiv col className="!p-0">
      <Divider />

      <div className="bg-white p-4">
        <div className="grid grid-cols-6 gap-y-2">
          <Line
            left={<span className="text-sm font-semibold">Mã</span>}
            mid={<span className="text-sm">{shift.id}</span>}
          />
          <Line
            left={<span className="text-sm font-semibold">Ngày tạo</span>}
            mid={
              <span className="text-sm">
                {dayjs(shift.beginDate).format("HH:mm DD/MM/YYYY")}
              </span>
            }
          />
        </div>
      </div>

      <Divider />

      <div className="bg-white p-4">
        <div className="grid grid-cols-6 gap-y-2">
          <Line
            left={<span className="text-sm font-semibold">Đầu ca</span>}
            mid={
              <span className="text-sm">
                Tiền mặt: {withThousandSeparators(shift.beginAmount)}
              </span>
            }
          />
        </div>
      </div>

      <Divider />

      <div className="bg-white p-4">
        <div className="grid grid-cols-7 gap-y-2">
          <Line
            left={<span className="text-sm font-semibold">Trong ca</span>}
            mid={
              <span className="text-sm">
                Tiền mặt: {withThousandSeparators(200000)}
              </span>
            }
          />

          <div className="col-span-6">
            <Collapse
              items={[
                {
                  title: (
                    <>
                      <div className="text-sm">Doanh thu</div>
                      <div className="text-sm">
                        {withThousandSeparators(200000)}
                      </div>
                    </>
                  ),
                  content: (
                    <div className="grid grid-cols-2 gap-y-1 pl-9">
                      <div className="col-span-1">Tiền mặt</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(100000)}
                      </div>

                      <div className="col-span-1">Chuyển khoản</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(100000)}
                      </div>

                      <div className="col-span-1">Ví điện tử</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(50000)}
                      </div>
                    </div>
                  ),
                },
                {
                  title: (
                    <>
                      <div className="text-sm">Phiếu thu</div>
                      <div className="text-sm">
                        {withThousandSeparators(200000)}
                      </div>
                    </>
                  ),
                  content: (
                    <div className="grid grid-cols-2 gap-y-1 pl-9">
                      <div className="col-span-1">Tiền mặt</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(100000)}
                      </div>

                      <div className="col-span-1">Chuyển khoản</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(100000)}
                      </div>

                      <div className="col-span-1">Ví điện tử</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(50000)}
                      </div>
                    </div>
                  ),
                },
                {
                  title: (
                    <>
                      <div className="text-sm">Phiếu chi</div>
                      <div className="text-sm">
                        {withThousandSeparators(200000)}
                      </div>
                    </>
                  ),
                  content: (
                    <div className="grid grid-cols-2 gap-y-1 pl-9">
                      <div className="col-span-1">Tiền mặt</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(100000)}
                      </div>

                      <div className="col-span-1">Chuyển khoản</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(100000)}
                      </div>

                      <div className="col-span-1">Ví điện tử</div>
                      <div className="col-span-1 text-right">
                        {withThousandSeparators(50000)}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <Divider />

      <EndShiftForm />
    </FlexDiv>
  );
};

export default ManageShiftPage;
