const metaSymbol: unique symbol = Symbol.for("meta");

export type ObjectMetaTarget = Partial<Record<typeof metaSymbol, Map<any, any>>>;

export class ObjectMeta {
    public static get<T>(target: ObjectMetaTarget, key: any, init: () => T): T {
        if (!Object.hasOwnProperty.call(target, metaSymbol)) {
            Object.defineProperty(target, metaSymbol, {
                configurable: true,
                enumerable: false,
                writable: false,
                value: new Map(),
            });
        }

        const map = target[metaSymbol]!;

        if (!map.has(key)) {
            map.set(key, init());
        }
        return map.get(key)!;
    }

    public static has(target: ObjectMetaTarget, key: any) {
        return Object.hasOwnProperty.call(target, metaSymbol) && target[metaSymbol]!.has(key);
    }
}
