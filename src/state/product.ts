import { getProductById, getStoreProductsByCategory } from "@/api/product";
import { CartOrderItem } from "@/types/cart";
import {
  CartProductVariant,
  CategoryWithProducts,
  OptionDetail,
  ProductWithOptions,
} from "@/types/product";
import { toTuples } from "@/utils/product";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import compact from "lodash/compact";
import { companyIdAtom, storeIdAtom } from ".";

export const productsQueryAtom = atomWithQuery<
  CategoryWithProducts[],
  Error,
  CategoryWithProducts[],
  [string, number | null, number | null]
>((get) => ({
  initialData: [],
  queryKey: ["products", get(storeIdAtom), get(companyIdAtom)],
  queryFn: async ({ queryKey: [, storeId, companyId] }) => {
    if (storeId == null || companyId == null) return [];

    const response = await getStoreProductsByCategory({
      filtered: [
        { id: "storeId", value: storeId },
        { id: "companyId", value: companyId },
        { id: "name", value: name ?? "" },
      ],
      sorted: [{ id: "seq", asc: true }],
      pageSize: 10,
      page: 0,
    });
    return response.data.data.filter(
      (category) => category.products.length > 0,
    );
  },
}));

export const categoryTuplesAtom = atom((get) => {
  const categoryNames = get(productsQueryAtom).data.map((cat) => cat.name);
  return toTuples(categoryNames);
});

export const selectedProductIdAtom = atom<string | null>(null);

export const singleProductQueryAtom = atomWithQuery<
  ProductWithOptions | null,
  Error,
  ProductWithOptions,
  [string, string | null]
>((get) => ({
  staleTime: Infinity,
  queryKey: ["product", get(selectedProductIdAtom)],
  queryFn: async ({ queryKey: [, selectedProductId] }) => {
    if (selectedProductId == null) return null;

    const response = await getProductById(selectedProductId);
    return response.data.data;
  },
}));

export const productVariantAtom = atom<
  CartOrderItem | CartProductVariant | null
>(null);

export const productVariantQtyAtom = atom(
  (get) => get(productVariantAtom)?.quantity,
  (get, set, action: "INC" | "DEC", minQty?: 0 | 1) => {
    const productVariant = get(productVariantAtom);
    if (productVariant == null) return;

    if (action === "INC") {
      set(productVariantAtom, {
        ...productVariant,
        quantity: productVariant.quantity + 1,
      });
    } else if (action === "DEC") {
      set(productVariantAtom, {
        ...productVariant,
        quantity: Math.max(minQty ?? 1, productVariant.quantity - 1),
      });
    }
  },
);

export const productVariantNoteAtom = atom(
  (get) => get(productVariantAtom)?.note ?? "",
  (get, set, note: string) => {
    const productVariant = get(productVariantAtom);
    if (productVariant == null) return;

    set(productVariantAtom, { ...productVariant, note });
  },
);

export const productVariantPriceAtom = atom((get) => {
  const productVariant = get(productVariantAtom) as CartProductVariant | null;
  if (productVariant == null) return 0;

  const quantity = productVariant.quantity;
  const basePrice = productVariant.priceSale;
  const optionsPrice = productVariant.options.reduce((acc, opt) => {
    const selectedDetailPrice = opt.selectedDetail?.price ?? 0;
    const selectedDetailsTotalAmount = opt.selectedDetails.reduce(
      (a, d) => a + d.price,
      0,
    );
    return acc + selectedDetailPrice + selectedDetailsTotalAmount;
  }, 0);

  return (basePrice + optionsPrice) * quantity;
});

export const prepareProductVariantAtom = atom(
  null,
  (_get, set, productDetails: ProductWithOptions) => {
    set(productVariantAtom, {
      ...productDetails,
      uniqIdentifier: `${productDetails.id}--${Date.now()}`,
      quantity: 1,
      options: productDetails.options.map((opt) =>
        opt.isMandatory
          ? {
              ...opt,
              selectedDetail: opt.details[0],
              selectedDetails: [],
            }
          : {
              ...opt,
              selectedDetail: null,
              selectedDetails: [],
            },
      ),
    });
  },
);

export const enrichProductVariantAtom = atom(
  null,
  (get, set, productDetails: ProductWithOptions) => {
    const productVariant = get(productVariantAtom) as CartOrderItem | null;
    if (productVariant == null) return;

    set(productVariantAtom, {
      ...productDetails,
      ...productVariant,
      options: productDetails.options.map((opt) => {
        const existingOpt = productVariant.options.find(
          ({ id }) => id === opt.id,
        );

        const selectedDetail =
          opt.details.find(
            ({ id }) => id === existingOpt?.selectedDetail?.id,
          ) ?? null;

        const selectedDetails = compact(
          (existingOpt?.selectedDetails ?? []).map((esd) =>
            opt.details.find((dtl) => dtl.id === esd.id),
          ),
        );

        return opt.isMandatory
          ? {
              ...opt,
              selectedDetail,
              selectedDetails: [],
            }
          : {
              ...opt,
              selectedDetail: null,
              selectedDetails,
            };
      }),
    });
  },
);

export const setVariantSelectedDetailAtom = atom(
  null,
  (get, set, targetOptionId: string, targetOptionDetailId: string) => {
    const productVariant = get(productVariantAtom);
    if (productVariant == null) return;

    const options = productVariant.options;
    const targetOption = options.find((opt) => opt.id === targetOptionId);
    if (targetOption == null) return;

    const newSelectedDetail = targetOption.details.find(
      (detail) => detail.id === targetOptionDetailId,
    );
    if (newSelectedDetail == null) return;

    const newOptions = options.map((opt) =>
      opt.id === targetOptionId
        ? {
            ...opt,
            selectedDetail: { ...newSelectedDetail },
            selectedDetails: [],
          }
        : opt,
    );
    set(productVariantAtom, { ...productVariant, options: newOptions });
  },
);

export const setVariantSelectedDetailsAtom = atom(
  null,
  (get, set, targetOptionId: string, targetOptionDetailIds: string[]) => {
    const productVariant = get(productVariantAtom);
    if (productVariant == null) return;

    const options = productVariant.options;
    const targetOption = options.find((opt) => opt.id === targetOptionId);
    if (targetOption == null) return;

    const targetOptionDetailIdsSet = new Set(targetOptionDetailIds);

    const newSelectedDetails = targetOption.details.reduce<OptionDetail[]>(
      (acc, detail) =>
        targetOptionDetailIdsSet.has(detail.id) ? [...acc, detail] : acc,
      [],
    );
    const newOptions = productVariant.options.map((opt) =>
      opt.id === targetOptionId
        ? {
            ...opt,
            selectedDetail: null,
            selectedDetails: newSelectedDetails,
          }
        : opt,
    );
    set(productVariantAtom, { ...productVariant, options: newOptions });
  },
);

export const productVariantPickerAtom = atom(false);
export const productVariantEditorAtom = atom(false);
