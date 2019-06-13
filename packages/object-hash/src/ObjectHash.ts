import {HybridMap, Str} from "@sirian/common";
import {SharedStore} from "@sirian/shared-store";

export class ObjectHash {
    protected static get store() {
        return SharedStore.get("@sirian/object-hash", () => ({nextId: 1, map: new HybridMap<any, number>()}));
    }

    public static getId(obj: any): string {
        if (null === obj || undefined === obj) {
            return "" + obj;
        }

        const type = typeof obj;

        switch (type) {
            case "boolean":
            case "undefined":
                return `${obj}`;
            case "number":
            case "string":
            case "bigint":
                return `${type}:${obj}`;
            case "symbol":
                return this.getSymbolId(obj);
            case "object":
            case "function":
                const id = this.getObjectId(obj);
                return `${type}#${id}`;
            default:
                throw new Error(`Unexpected type ${type}`);
        }
    }

    protected static nextId() {
        return this.store.nextId++;
    }

    protected static getObjectId(obj: object) {
        const map = this.store.map;
        if (!map.has(obj)) {
            map.set(obj, this.nextId());
        }
        return map.get(obj)!;
    }

    protected static getSymbolId(s: symbol) {
        const key = Symbol.keyFor(s);
        if (undefined !== key) {
            return `symbol:${key}`;
        }

        const map = this.store.map;
        if (!map.has(s)) {
            const str = Str.stringify(s);
            const match = str.match(/^Symbol\((.+)\)$/);
            if (match) {
                return `symbol=${match[1]}`;
            }
            map.set(s, this.nextId());
        }

        const id = map.get(s)!;

        return `symbol#${id}`;
    }
}
