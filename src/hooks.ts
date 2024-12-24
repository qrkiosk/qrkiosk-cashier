import {
  cartState,
  cartTotalState,
  currentOrderIdAtom,
  currentTableAtom,
  draftOrderAtom,
  isAuthenticatedAtom,
  logoutAtom,
  openShiftModalAtom,
  tablesQueryAtom,
} from "@/state";
import { resetCartAtom } from "@/state/cart";
import { has401Atom, hasOngoing401ErrorAtom } from "@/state/error-handling";
import {
  productVariantAtom,
  productVariantEditorAtom,
  productVariantPickerAtom,
  resetFocusedCategoryIdAtom,
  selectedProductIdAtom,
} from "@/state/product";
import { CartItem } from "@/types/cart";
import { withErrorStatusCodeHandler } from "@/utils/error";
import { getConfig } from "@/utils/template";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import debounce from "lodash/debounce";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { UIMatch, useMatches, useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { openChat, purchase } from "zmp-sdk";

export function useRealHeight(
  element: MutableRefObject<HTMLDivElement | null>,
  defaultValue?: number,
) {
  const [height, setHeight] = useState(defaultValue ?? 0);
  useLayoutEffect(() => {
    if (element.current && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const [{ contentRect }] = entries;
        setHeight(contentRect.height);
      });
      ro.observe(element.current);
      return () => ro.disconnect();
    }
    return () => {};
  }, [element.current]);

  if (typeof ResizeObserver === "undefined") {
    return -1;
  }
  return height;
}

export function useCustomerSupport() {
  return () =>
    openChat({
      type: "oa",
      id: getConfig((config) => config.template.oaIDtoOpenChat),
    });
}

export function useToBeImplemented() {
  return () =>
    toast("Chức năng dành cho các bên tích hợp phát triển...", {
      icon: "🛠️",
    });
}

export function useCheckout() {
  const { totalAmount } = useAtomValue(cartTotalState);
  const setCart = useSetAtom(cartState);
  return async () => {
    try {
      await purchase({
        amount: totalAmount,
        desc: "Thanh toán đơn hàng",
        method: "",
      });
      toast.success("Thanh toán thành công. Cảm ơn bạn đã mua hàng!", {
        icon: "🎉",
      });
      setCart([]);
    } catch (error) {
      toast.error(
        "Thanh toán thất bại. Vui lòng kiểm tra nội dung lỗi bên trong Console.",
      );
      console.warn(error);
    }
  };
}

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<
    undefined,
    {
      title?: string | Function;
      logo?: boolean;
      back?: boolean;
      backAppearance?: "back" | "close";
      user?: boolean;
      headerless?: boolean;
      footerless?: boolean;
      scrollRestoration?: number;
    }
  >[];
  const lastMatch = matches[matches.length - 1];

  return [lastMatch.handle ?? {}, lastMatch, matches] as const;
}

/* ===== */

export const useRemoveQueriesOnUnmount = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  useEffect(
    () => () => {
      queryClient.removeQueries({ queryKey, exact: true });
    },
    [],
  );
};

export const useOpenShiftModal = () => {
  const [state, setState] = useAtom(openShiftModalAtom);
  const onOpen = useCallback(() => setState(true), []);
  const onClose = useCallback(() => setState(false), []);

  return { isOpen: state, onOpen, onClose };
};

export const use401ErrorFlag = () => {
  const set = useSetAtom(hasOngoing401ErrorAtom);
  const escalate = useCallback(() => set(true), []);
  const deEscalate = useCallback(() => set(false), []);

  return { escalate, deEscalate };
};

const showErrorToastDebounced = debounce(() => {
  toast.error(
    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.",
    { duration: 5000 },
  );
}, 500);

export const useHandle401 = () => {
  const navigate = useNavigate();
  const logout = useSetAtom(logoutAtom);
  const has401 = useAtomValue(has401Atom);
  const { deEscalate } = use401ErrorFlag();

  useEffect(() => {
    if (has401) {
      deEscalate();
      showErrorToastDebounced();
      logout();
      navigate("/login", { replace: true });
    }
  }, [has401]);
};

export const useCheckUserSession = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/menu-table", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated]);
};

export const useFocusedInputRef = <
  T extends HTMLInputElement | HTMLTextAreaElement,
>(
  shouldFocus = true,
) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!shouldFocus) return;

    setTimeout(() => {
      ref.current?.focus();
    });
  }, [shouldFocus]);

  return ref;
};

export const useProductVariantPicker = () => {
  const [state, setState] = useAtom(productVariantPickerAtom);
  const setSelectedProductId = useSetAtom(selectedProductIdAtom);
  const setProductVariant = useSetAtom(productVariantAtom);

  const onOpen = useCallback((productId: string) => {
    setState(true);
    setSelectedProductId(productId);
  }, []);

  const onClose = useCallback(() => {
    setState(false);
    setProductVariant(null);
    setSelectedProductId(null);
  }, []);

  return { isOpen: state, onOpen, onClose };
};

export const useProductVariantEditor = () => {
  const [state, setState] = useAtom(productVariantEditorAtom);
  const setSelectedProductId = useSetAtom(selectedProductIdAtom);
  const setProductVariant = useSetAtom(productVariantAtom);

  const onOpen = useCallback((productId: string, productVariant: CartItem) => {
    setState(true);
    setProductVariant(productVariant);
    setSelectedProductId(productId);
  }, []);

  const onClose = useCallback(() => {
    setState(false);
    setProductVariant(null);
    setSelectedProductId(null);
  }, []);

  return { isOpen: state, onOpen, onClose };
};

export const useAuthorizedApi = <T extends (...args: any[]) => Promise<any>>(
  api: T,
): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) => {
  const { escalate } = use401ErrorFlag();
  return useMemo(
    () =>
      withErrorStatusCodeHandler(api, [{ statusCode: 401, handler: escalate }]),
    [],
  );
};

export const useResetOrderDetailsAndExitCallback = () => {
  const { refetch: refetchTables } = useAtomValue(tablesQueryAtom);
  const setCurrentOrderId = useSetAtom(currentOrderIdAtom);
  const resetCart = useSetAtom(resetCartAtom);
  const resetFocusedCategoryId = useSetAtom(resetFocusedCategoryIdAtom);
  const setCurrentTable = useSetAtom(currentTableAtom);
  const navigate = useNavigate();

  return useCallback(() => {
    setTimeout(refetchTables, 500);
    setCurrentOrderId(null);
    resetCart();
    resetFocusedCategoryId();
    setCurrentTable(null);
    navigate(-1);
  }, []);
};

export const useResetDraftOrderAndExitCallback = () => {
  const { refetch: refetchTables } = useAtomValue(tablesQueryAtom);
  const setDraftOrder = useSetAtom(draftOrderAtom);
  const resetCart = useSetAtom(resetCartAtom);
  const resetFocusedCategoryId = useSetAtom(resetFocusedCategoryIdAtom);
  const setCurrentTable = useSetAtom(currentTableAtom);
  const navigate = useNavigate();

  return useCallback(() => {
    setTimeout(refetchTables, 500);
    setDraftOrder({});
    resetCart();
    resetFocusedCategoryId();
    setCurrentTable(null);
    navigate(-1);
  }, []);
};

export const useDeviceMode = () => {
  const matches = useMediaQuery("(min-width: 768px)");
  return matches ? "tablet" : "mobile";
};
