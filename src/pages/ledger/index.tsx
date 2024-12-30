import Button from "@/components/button";
import EmptyState from "@/components/empty-state";
import FlexDiv from "@/components/flex-div";
import HorizontalDivider from "@/components/horizontal-divider";
import { ledgerBookQueryAtom } from "@/state/company";
import { LedgerAccountType } from "@/types/company";
import { withThousandSeparators } from "@/utils/number";
import { searchLedgerAccounts } from "@/utils/search";
import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCreditCard,
  FaMagnifyingGlass,
  FaPenToSquare,
} from "react-icons/fa6";
import { Spinner } from "zmp-ui";
import Actions from "./actions";
import {
  selectedLedgerAccountAtom,
  useEditExpenseModal,
  useEditRevenueModal,
} from "./local-state";

type AccountTypeFilter = "ALL" | LedgerAccountType;

const LedgerPage = () => {
  const [search, setSearch] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] =
    useState<AccountTypeFilter>("ALL");

  const {
    data: ledgerBook,
    isLoading,
    error,
    refetch: refetchLedgerBook,
  } = useAtomValue(ledgerBookQueryAtom);

  const filteredLedgerBook = useMemo(() => {
    const paymentFilteredOrders = ledgerBook.filter((account) => {
      switch (accountTypeFilter) {
        case LedgerAccountType.REVENUE:
          return account.type === LedgerAccountType.REVENUE;
        case LedgerAccountType.EXPENSE:
          return account.type === LedgerAccountType.EXPENSE;
        case "ALL":
        default:
          return true;
      }
    });

    return paymentFilteredOrders;

    if (isEmpty(search)) {
      return paymentFilteredOrders;
    }
    return searchLedgerAccounts(search, paymentFilteredOrders);
  }, [ledgerBook, accountTypeFilter, search]);

  const setSelectedLedgerAccount = useSetAtom(selectedLedgerAccountAtom);
  const { onOpen: onOpenEditRevenueModal } = useEditRevenueModal();
  const { onOpen: onOpenEditExpenseModal } = useEditExpenseModal();

  if (isLoading) {
    return (
      <FlexDiv row center>
        <Spinner />
      </FlexDiv>
    );
  }

  if (error) {
    return (
      <FlexDiv col center className="space-y-4">
        <p className="text-sm text-subtitle">Lỗi: Không thể tải dữ liệu.</p>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await refetchLedgerBook();
            } catch {
              toast.error("Xảy ra lỗi khi tải dữ liệu.");
            }
          }}
        >
          Tải lại
        </Button>
      </FlexDiv>
    );
  }

  return (
    <>
      <Actions />

      <FlexDiv col className="!p-0">
        <div className="flex items-center space-x-2 border-b-[1px] border-b-black/5 bg-white p-4">
          <div className="relative w-3/4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={accountTypeFilter}
              onChange={(e) => {
                setAccountTypeFilter(e.target.value as AccountTypeFilter);
              }}
            >
              <option value="ALL">Tất cả</option>
              <option value={LedgerAccountType.REVENUE}>Phiếu thu</option>
              <option value={LedgerAccountType.EXPENSE}>Phiếu chi</option>
            </select>
          </div>
        </div>

        {isEmpty(filteredLedgerBook) ? (
          <EmptyState message="Không có dữ liệu." />
        ) : (
          <div className="bg-white">
            {filteredLedgerBook.map((account) => (
              <Fragment key={account.id}>
                <div
                  className="cursor-pointer space-y-1 px-5 py-4"
                  onClick={() => {
                    setSelectedLedgerAccount(account);
                    setTimeout(() => {
                      if (account.type === LedgerAccountType.REVENUE) {
                        onOpenEditRevenueModal();
                      } else if (account.type === LedgerAccountType.EXPENSE) {
                        onOpenEditExpenseModal();
                      }
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-primary">
                      <FaCreditCard />
                      <span className="font-semibold text-primary">
                        {withThousandSeparators(account.amount)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {dayjs(account.createdAt).format("HH:mm DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer">
                      <p className="text-xs text-subtitle">
                        {compact([
                          account.employeeName,
                          account.paymentMethod,
                        ]).join(" • ")}
                      </p>
                      <p className="text-xs text-subtitle">{account.note}</p>
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
