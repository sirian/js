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

export const pickSet: {
    <T>(set: ISetMini<T>, value: T, strict: true): T;
    <T>(set: ISetMini<T>, value: T, strict?: boolean): T | undefined;
} = <T>(set: ISetMini<T>, value: T, throws = false) => {
    if (set.has(value)) {
        set.delete(value);
        return value;
    }
    assert(!throws);
};
