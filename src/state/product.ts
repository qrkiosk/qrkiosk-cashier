import {
  getProductById,
  getProducts,
  getStoreProductsByCategory,
} from "@/api/product";
import { CartItem, CartProductVariant } from "@/types/cart";
import {
  CategoryWithProducts,
  OptionDetail,
  Product,
  ProductWithOptions,
} from "@/types/product";
import { toTuples } from "@/utils/product";
import { searchProducts } from "@/utils/search";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import { companyIdAtom, storeIdAtom, tokenAtom } from ".";

export const ALL_CATEGORIES = "ALL_CATEGORIES";

export const categoriesWithProductsQueryAtom = atomWithQuery<
  CategoryWithProducts[],
  Error,
  CategoryWithProducts[],
  [string, number | null, number | null]
>((get) => ({
  initialData: [],
  queryKey: ["categoriesWithProducts", get(storeIdAtom), get(companyIdAtom)],
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

export const categorizedProductsAtom = atom(
  (get) => get(categoriesWithProductsQueryAtom).data,
);

export const focusedCategoryIdAtom = atom(ALL_CATEGORIES);
export const resetFocusedCategoryIdAtom = atom(null, (_, set) => {
  set(focusedCategoryIdAtom, ALL_CATEGORIES);
});

export const filteredCategoriesAtom = atom((get) => {
  const focusedCategoryId = get(focusedCategoryIdAtom);
  const all = get(categorizedProductsAtom);

  if (focusedCategoryId === ALL_CATEGORIES) {
    return all;
  }

  return all.filter(({ id }) => id === focusedCategoryId);
});

export const categoryEntriesAtom = atom((get) => {
  const defaultEntry = {
    value: ALL_CATEGORIES,
    text: "Tất cả",
  };
  const categoryEntries = get(categorizedProductsAtom).map((cat) => ({
    value: cat.id,
    text: cat.name,
  }));

  return [defaultEntry, ...categoryEntries];
});

export const categoryTuplesAtom = atom((get) => {
  const categories = get(categoryEntriesAtom);
  return toTuples(categories);
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

export const productVariantAtom = atom<CartItem | null>(null);

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
  (_, set, productDetails: ProductWithOptions) => {
    set(productVariantAtom, {
      ...productDetails,
      uniqIdentifier: `${productDetails.id}--${Date.now()}`,
      isActive: true,
      isDone: false,
      serviceTaskId: null,
      originalOrderDetailId: null,
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
    const productVariant = get(productVariantAtom);
    if (productVariant == null) return;

    set(productVariantAtom, {
      ...productDetails,
      ...productVariant,
      isActive: true,
      isDone: false,
      serviceTaskId: productVariant.serviceTaskId ?? null,
      originalOrderDetailId: productVariant.originalOrderDetailId ?? null,
      options: productDetails.options.map((opt) => {
        const existingOpt = productVariant.options.find(
          ({ id }) => id === opt.id,
        );

        if (!existingOpt) {
          return {
            ...opt,
            selectedDetail: null,
            selectedDetails: [],
          };
        }

        // Gotta exhaustively look up in both selectedDetail and selectedDetails
        const allSelectedDetailIds = new Set(
          compact([
            existingOpt.selectedDetail,
            ...existingOpt.selectedDetails,
          ]).map(({ id }) => id),
        );

        if (opt.isMandatory) {
          const selectedDetail =
            opt.details.find((detail) => allSelectedDetailIds.has(detail.id)) ??
            null;

          return {
            ...opt,
            selectedDetail,
            selectedDetails: [],
          };
        }

        const selectedDetails = opt.details.reduce((acc, detail) => {
          if (allSelectedDetailIds.has(detail.id)) {
            return [...acc, detail];
          }
          return acc;
        }, []);

        return {
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

export const searchProductQueryAtom = atom<string>("");

export const searchProductResultsAtom = atom<CategoryWithProducts[]>((get) => {
  const searchQuery = get(searchProductQueryAtom);
  const products = get(categorizedProductsAtom);

  if (isEmpty(searchQuery)) return products;

  return searchProducts(searchQuery, products);
});

export const productsQueryAtom = atomWithQuery<
  Product[],
  Error,
  Product[],
  [string, string]
>((get) => ({
  initialData: [],
  queryKey: ["products", get(tokenAtom)],
  queryFn: async ({ queryKey: [, token] }) => {
    const response = await getProducts(
      {
        filtered: [{ id: "name", value: name ?? "" }],
        sorted: [{ id: "seq", asc: true }],
        pageSize: 100,
        page: 0,
      },
      token,
    );
    return response.data.data;
  },
}));
