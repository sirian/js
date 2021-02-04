export const toArray = <T>(value?: Iterable<T> | ArrayLike<T> | null) => Array.from(value ?? []);
