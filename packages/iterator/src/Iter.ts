export type AnyIterable<V = any> = Iterable<V> | AsyncIterable<V>;

export class Iter {
    public static async toArray<V>(value: AnyIterable<V>): Promise<V[]> {
        const res = [];
        for await (const x of value) {
            res.push(x);
        }
        return res;
    }
}
