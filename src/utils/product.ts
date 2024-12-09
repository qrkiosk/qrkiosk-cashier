import { CategoryWithProducts } from "@/types/product";
import Fuse from "fuse.js";
import sortBy from "lodash/sortBy";

export function toTuples<T>(arr: T[]): Array<[T, T] | [T]> {
  const lastIndex = arr.length - 1;

  return arr.reduce<Array<[T, T] | [T]>>((result, _, i) => {
    if (i % 2 === 0) {
      const tuple: [T, T] | [T] =
        i < lastIndex ? [arr[i], arr[i + 1]] : [arr[i]]; // Push a 2-tuple if there's a pair, otherwise push a 1-tuple

      return [...result, tuple];
    }

    return result;
  }, []);
}

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
