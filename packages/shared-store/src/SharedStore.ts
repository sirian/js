import {HybridMap} from "@sirian/common";

const symbol: unique symbol = Symbol.for("@sirian/shared-store");

export class SharedStore {
    public static get<T>(key: any, init: () => T) {
        const target = globalThis as { [symbol]?: HybridMap<any, any> };

        if (!target[symbol]) {
            target[symbol] = new HybridMap();
        }

        return target[symbol]!.ensure(key, init);
    }
}
