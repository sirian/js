import {HybridMap} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";

export interface ISharedStoreOptions<T> {
    target?: any;
    propertyKey?: PropertyKey;
    key: any;
    init: () => T;
}

export class SharedStore {
    public static get<T>(data: ISharedStoreOptions<T>): T;
    public static get<T>(key: any, init: () => T): T;
    public static get(opts: any, fn?: Func) {
        if (fn) {
            return SharedStore.get({
                key: opts,
                init: fn,
            });
        }

        const {
            target = globalThis,
            propertyKey = Symbol.for("@sirian/shared-store"),
            key,
            init,
        } = opts;

        if (!target[propertyKey]) {
            target[propertyKey] = new HybridMap();
        }

        const map = target[propertyKey] as HybridMap<any, any>;

        if (!map.has(key)) {
            map.set(key, init());
        }

        return map.get(key)!;
    }
}
