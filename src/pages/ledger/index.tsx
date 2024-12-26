import Button from "@/components/button";
import EmptyState from "@/components/empty-state";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import { withThousandSeparators } from "@/utils/number";
import dayjs from "dayjs";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import { Fragment, useState } from "react";
import {
  FaCreditCard,
  FaMagnifyingGlass,
  FaPenToSquare,
} from "react-icons/fa6";
import Actions from "./actions";

const LedgerPage = () => {
  const [input, setInput] = useState("");

  return (
    <>
      <Actions />

      <FlexDiv col className="!p-0">
        <div className="flex items-center space-x-2 border-b-[1px] border-b-black/5 bg-white p-4">
          <div className="relative w-3/4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tìm kiếm"
              className="h-10 w-full rounded-lg bg-section pl-4 pr-3 text-xs normal-case outline-none placeholder:text-2xs placeholder:text-inactive"
            />
            <FaMagnifyingGlass
              fontSize={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-inactive"
            />
          </div>
          <div className="w-1/4">
            <select
              className="h-10 w-full rounded-lg bg-section px-1.5 text-xs normal-case outline-none placeholder:text-inactive"
              defaultValue="1"
            >
              <option value="1">Tất cả</option>
              <option value="2">Phiếu thu</option>
              <option value="3">Phiếu chi</option>
            </select>
          </div>
        </div>

        {isEmpty([1]) ? (
          <EmptyState message="Không có dữ liệu." />
        ) : (
          <div className="bg-white">
            {[
              {
                id: 1,
                employeeName: "Cashier",
                paymentMethod: "COD",
                amount: 10000,
                note: "abc",
                createdAt: dayjs().toISOString(),
              },
              {
                id: 2,
                employeeName: "Cashier",
                paymentMethod: "COD",
                amount: 10000,
                note: "abc",
                createdAt: dayjs().toISOString(),
              },
            ].map((record) => (
              <Fragment key={record.id}>
                <div className="space-y-1 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary">
                      <FaCreditCard />
                      <span className="font-semibold text-primary">
                        {withThousandSeparators(record.amount)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {dayjs(record.createdAt).format("HH:mm DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer">
                      <p className="text-xs text-subtitle">
                        {compact([
                          record.employeeName,
                          record.paymentMethod,
                        ]).join(" • ")}
                      </p>
                      <p className="text-xs text-subtitle">{record.note}</p>
                    </div>
                    <div className="flex items-center pl-3">
                      <Button size="sm" variant="text" onClick={() => {}}>
                        <FaPenToSquare
                          className="text-subtitle"
                          fontSize={16}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
                <HorizontalDivider />
              </Fragment>
            ))}
          </div>
        )}
      </FlexDiv>
    </>
  );
};

export default LedgerPage;
