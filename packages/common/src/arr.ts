import {ArrayRO, LastElement, TupleOf} from "@sirian/ts-extra-types";
import {isArray} from "./Is";
import {compare, isArrayLike, isEqual, isIterable} from "./var";

export const range = (from: number, to: number, step = 1) => {
    const result = [];
    const sign = step > 0 ? 1 : -1;
    while (sign * (to - from) >= 0) {
        result.push(from);
        from += step;
    }
    return result;
};

type First<T> =
    T extends { 0: infer V1 } ? V1 :
    T extends { 0?: infer V2 } ? V2 | undefined :
    T extends Iterable<infer V3> | ArrayLike<infer V3> ? V3 | undefined :
    never;

export const first = <T extends Iterable<any> | ArrayLike<any>>(value: T) => {
    if (isIterable(value)) {
        for (const x of value) {
            return x as First<T>;
        }
    }
    return (value as any)[0] as First<T>;
};

export const firstN = <T>(value: IterableIterator<T>, limit: number): T[] => {
    const result = [];

    for (const x of value) {
        if (result.length >= limit) {
            break;
        }
        result.push(x);
    }

    return result;
};

type Last<T> =
    T extends ArrayRO ? LastElement<T> :
    T extends Iterable<infer V> | ArrayLike<infer V> ? V | undefined :
    never;

export const last = <T extends Iterable<any> | ArrayLike<any>>(value: T) => {
    if (isArrayLike(value)) {
        return value[value.length - 1] as Last<T>;
    }
    let res;
    if (isIterable(value)) {
        for (const x of value) {
            res = x;
        }
    }
    return res as Last<T>;
};

export const toArray: {
    <T>(value: T):
        T extends null | undefined ? [] :
        T extends ArrayRO ? T :
        T extends ArrayLike<infer V> | Iterable<infer V> ? V[] :
        never;
} =
    (value: any): any => isArray(value) ? value : Array.from(value ?? []); // eslint-disable-line unicorn/prefer-spread

export const uniq = <T>(input: Iterable<T>) => [...new Set(input)];

export const makeArray = <N extends number, T = undefined>(length: N, fill: (index: number) => T) =>
    Array.from({length}, (v, i) => fill(i)) as TupleOf<T, N>;

export const intersect = <T>(array: Iterable<T>, ...arrays: Array<Iterable<T>>): T[] => {
    const sets = arrays.map((arr) => new Set(arr));

    return toArray(array).filter((value) => sets.every((set) => set.has(value)));
};

export const swap = (arr: unknown[], i: number, j: number) => {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
};

export const arrRemoveItem = <T>(array: T[], value: T, limit?: number) =>
    arrRemove(array, (item) => isEqual(item, value), limit);

export const arrRemove = <T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean, limit = 1 / 0) => {
    let removed = 0;

    for (let i = 0; i < array.length && removed < limit;) {
        const remove = predicate(array[i], i, array);

        if (!remove) {
            i++;
            continue;
        }

        removed++;
        array.splice(i, 1);
    }

    return array;
};

export const arrChunk = (value: any[], size: number) => {
    const result = [];

    for (let i = 0; i < value.length; i += size) {
        result.push(value.slice(i, i + size));
    }
    return result;
};

export const sort = <T>(array: T[], fn: (a: T, b: T) => number = compare) => array.sort(fn);

export const sortBy = <T>(array: T[], fn: (v: T, i: number) => unknown) => {
    [...array]
        .map((v, i) => [fn(v, i), v] as const)
        .sort((a, b) => compare(a[0], b[0]))
        .forEach((x, i) => array[i] = x[1]);

    return array;
};

export const each = <T>(value: Iterable<T>, fn: (v: T, i: number) => unknown) => [...value].forEach((v, i) => fn(v, i));

export const every = <T>(value: Iterable<T>, fn: (v: T, i: number) => any) => [...value].every((v, i) => fn(v, i));

export const some = <T>(value: Iterable<T>, fn: (v: T, i: number) => any) => [...value].some((v, i) => fn(v, i));

export const isEqualTuple = <T extends any[]>(x: T, y: any[]): y is T =>
    isArray(x)
    && isArray(y)
    && x.length === y.length
    && every(x, (v, i) => isEqual(v, y[i]));
