import {Ref} from "@sirian/common";

export type AnyIterable<V = any> = Iterable<V> | AsyncIterable<V>;

export class Iter {
    public static async toArray<V>(value: AnyIterable<V>): Promise<V[]> {
        const res = [];
        for await (const x of value) {
            res.push(x);
        }
        return res;
    }

    public static isAsyncIterable(value: any): value is AsyncIterable<any> {
        return Ref.hasMethod(value, Symbol.asyncIterator);
    }

    public static isIterable(value: any): value is Iterable<any> {
        return Ref.hasMethod(value, Symbol.iterator);
    }

    public static isAnyIterable(value: any): value is AnyIterable {
        return this.isAsyncIterable(value) || this.isIterable(value);
    }
}
