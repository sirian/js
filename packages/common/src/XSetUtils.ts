import {assert} from "./Error";

export interface ISetMini<T> {
    delete(value: T): boolean;

    has(value: T): boolean;

    add(value: T): this;
}

export const insertSet = <T>(set: ISetMini<T>, value: T) => {
    if (set.has(value)) {
        return false;
    }

    set.add(value);
    return true;
};

export function pickSet<T>(set: ISetMini<T>, value: T, strict: true): T;
export function pickSet<T>(set: ISetMini<T>, value: T, strict?: boolean): T | undefined;
export function pickSet<T>(set: ISetMini<T>, value: T, throws = false) {
    if (set.has(value)) {
        set.delete(value);
        return value;
    }
    assert(!throws);
}
