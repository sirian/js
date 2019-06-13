import {HybridMap} from "@sirian/common";

const symbol: unique symbol = Symbol.for("@sirian/shared-store");
const target: {[symbol]?: HybridMap<any, any>} = Symbol as any;

export class SharedStore {
    public static get<T>(key: any, init: () => T) {
        if (!target[symbol]) {
            target[symbol] = new HybridMap();
        }
        const map = target[symbol]!;

        if (!map.has(key)) {
            map.set(key, init());
        }

        return map.get(key)! as T;
    }
}
