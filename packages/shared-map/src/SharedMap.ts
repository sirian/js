import {HybridMap} from "@sirian/common";

const symbol: unique symbol = Symbol.for("@sirian/shared-map");
const target: {[symbol]?: HybridMap<any, HybridMap<any, any>>} = Symbol as any;

export class SharedMap {
    public static get<K, V>(key: any) {
        if (!target[symbol]) {
            target[symbol] = new HybridMap();
        }
        const map = target[symbol]!;

        if (!map.has(key)) {
            map.set(key, new HybridMap());
        }

        return map.get(key)! as HybridMap<K, V>;
    }
}
