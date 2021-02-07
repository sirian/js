import {ArrayRO, LastElement, Nullish, TupleOf} from "@sirian/ts-extra-types";
import {isArray, isArrayLike, isEqual, isIterable, isNullish} from "./Var";

export const range = (from: number, to: number, step: number = 1) => {
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

export const each = <T>(value: Iterable<T>, fn: (value: T) => boolean | void) => {
    for (const x of value) {
        if (false === fn(x)) {
            break;
        }
    }
};

export const first = <T extends Iterable<any> | ArrayLike<any>>(value: T) => {
    if (isIterable(value)) {
        for (const x of value) {
            return x as First<T>;
        }
    }
    return (value as any)[0] as First<T>;
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

export const toArray = <T>(value?: Iterable<T> | ArrayLike<T> | null): T[] => {
    if (isArray(value)) {
        return value;
    }

    return isNullish(value) ? [] : Array.from(value);
};
export const castArray = <T>(value: T): T extends ArrayRO ? T : T extends Nullish ? [] : [T] => {
    if (isNullish(value)) {
        return [] as any;
    }
    return (isArray(value) ? value : [value]) as any;
};

export const uniq = <T>(input: Iterable<T>) => {
    return [...new Set(input)];
};

export const makeArray = <N extends number, T = undefined>(length: N, fill?: (index: number) => T) => {
    const a = Array(length);
    if (fill) {
        for (let i = 0; i < length; i++) {
            a[i] = fill(i);
        }
    }
    return a as TupleOf<T, N>;
};

export const intersect = <T>(array: Iterable<T>, ...arrays: Array<Iterable<T>>): T[] => {
    const sets = arrays.map((arr) => new Set(arr));

    return toArray(array).filter((value) => sets.every((set) => set.has(value)));
};

export class Arr {
    public static removeItem<T>(array: T[], value: T, limit?: number) {
        return Arr.remove(array, (item) => isEqual(item, value), limit);
    }

    public static remove<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean, limit = 1 / 0) {
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
    }

    public static chunk(value: any[], size: number) {
        const result = [];

        for (let i = 0; i < value.length; i += size) {
            result.push(value.slice(i, i + size));
        }
        return result;
    }
}
