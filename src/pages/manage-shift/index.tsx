import Button from "@/components/button";
import FlexDiv from "@/components/flex-div";
import Divider from "@/components/section-divider";
import { withThousandSeparators } from "@/utils/number";
import classNames from "classnames";
import dayjs from "dayjs";
import { ReactNode } from "react";
import Collapse from "./collapse";

const Line = ({
  left,
  mid,
  right,
  leftIndent = false,
}: {
  left: ReactNode;
  mid: ReactNode;
  right?: ReactNode;
  leftIndent?: boolean;
}) => {
  return (
    <>
      <div
        className={classNames("col-span-3 flex items-center", {
          "pl-2": leftIndent,
        })}
      >
        {left}
      </div>
      <div className="col-span-3 flex items-center justify-end">{mid}</div>
      {right && <div className="col-span-1 flex items-center">{right}</div>}
    </>
  );
};

const ManageShiftPage = () => {
  return (
    <FlexDiv col className="!p-0">
      <Divider />

      <div className="bg-white p-4">
        <div className="grid grid-cols-6 gap-y-2">
          <Line
            left={<span className="text-sm font-semibold">Mã</span>}
            mid={<span className="text-sm">6986411313</span>}
          />
          <Line
            left={<span className="text-sm font-semibold">Ngày tạo</span>}
            mid={
              <span className="text-sm">
                {dayjs().format("HH:mm DD/MM/YYYY")}
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
                Tiền mặt: {withThousandSeparators(200000)}
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

      <div className="bg-white p-4">
        <div className="grid grid-cols-6 gap-y-2">
          <Line
            left={<span className="text-sm font-semibold">Cuối ca</span>}
            mid={
              <span className="text-sm font-semibold">
                Tiền mặt: {withThousandSeparators(200000)}
              </span>
            }
          />
          <Line
            leftIndent
            left={
              <label htmlFor="actual-cash" className="text-sm">
                Tiền mặt thực tế
              </label>
            }
            mid={
              <input
                id="actual-cash"
                type="number"
                placeholder="Nhập số tiền"
                className={classNames(
                  "h-8 w-3/4 rounded-lg bg-section pl-4 pr-3 text-xs normal-case outline-none placeholder:text-inactive",
                  {
                    "border-2 border-red-500": false,
                  },
                )}
              />
            }
          />
          <Line
            leftIndent
            left={<span className="text-sm">Số tiền chênh lệch</span>}
            mid={
              <span className="text-sm font-semibold">
                {withThousandSeparators(0)}
              </span>
            }
          />

          <div className="col-span-6 pl-2">
            <label htmlFor="shift-note" className="text-sm">
              Ghi chú
            </label>
            <textarea
              id="shift-note"
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg bg-section p-4 text-sm normal-case outline-none placeholder:text-inactive"
              style={{ transition: "height none" }}
              placeholder="Nhập ghi chú"
            />
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex justify-center space-x-3 p-2">
        <Button variant="secondary">Hủy</Button>
        <Button variant="primary">Đóng ca</Button>
      </div>
    </FlexDiv>
  );
};

export default ManageShiftPage;
