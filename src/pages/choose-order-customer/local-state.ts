import { atom, useAtom } from "jotai";
import { useCallback } from "react";

export const addModalAtom = atom(false);
export const editModalAtom = atom(false);

export const useAddModal = () => {
  const [isOpen, setIsOpen] = useAtom(addModalAtom);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
};

export const useEditModal = () => {
  const [isOpen, setIsOpen] = useAtom(editModalAtom);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
};
