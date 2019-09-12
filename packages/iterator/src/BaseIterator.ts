export abstract class BaseIterator<V> {
    public async toArray() {
        const res = [];
        for await (const x of this) {
            res.push(x);
        }
        return res;
    }

    public abstract [Symbol.asyncIterator](): AsyncIterator<V>;
}
