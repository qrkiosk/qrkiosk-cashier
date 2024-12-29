import { LedgerAccount } from "@/types/company";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

export const selectedLedgerAccountAtom = atom<LedgerAccount | null>(null);
export const addRevenueModalAtom = atom(false);
export const editRevenueModalAtom = atom(false);
export const addExpenseModalAtom = atom(false);
export const editExpenseModalAtom = atom(false);

export const useAddRevenueModal = () => {
  const [isOpen, setIsOpen] = useAtom(addRevenueModalAtom);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
};

export const useEditRevenueModal = () => {
  const [isOpen, setIsOpen] = useAtom(editRevenueModalAtom);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
};

export const useAddExpenseModal = () => {
  const [isOpen, setIsOpen] = useAtom(addExpenseModalAtom);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
};

export const useEditExpenseModal = () => {
  const [isOpen, setIsOpen] = useAtom(editExpenseModalAtom);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
};
