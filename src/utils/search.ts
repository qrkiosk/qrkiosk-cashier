import { Customer } from "@/types/customer";
import { CategoryWithProducts } from "@/types/product";
import Fuse from "fuse.js";
import sortBy from "lodash/sortBy";

export function searchProducts(
  searchQuery: string,
  dataSet: CategoryWithProducts[],
) {
  const fuse = new Fuse(dataSet, {
    includeScore: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: "products.name", weight: 2 },
      { name: "name", weight: 1 },
    ],
  });
  const raw = fuse.search(searchQuery).map((result) => result.item);
  return sortBy(raw, "seq");
}

export function searchCustomers(searchQuery: string, dataSet: Customer[]) {
  const fuse = new Fuse(dataSet, {
    includeScore: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: "name", weight: 1 },
      { name: "phoneNumber", weight: 1 },
    ],
  });
  const raw = fuse.search(searchQuery).map((result) => result.item);
  return sortBy(raw, "seq");
}
