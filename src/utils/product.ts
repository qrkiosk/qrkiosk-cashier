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
