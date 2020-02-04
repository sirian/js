import {isString, Obj, Ref} from "@sirian/common";
import {SharedStore} from "@sirian/shared-store";

export class ObjectRef {
    public readonly id: number;
    public readonly name: string;

    protected constructor(target: object, id: number) {
        this.id = id;
        this.name = ObjectRef.guessName(target) + "#" + id;
    }

    public static get store() {
        return SharedStore.get({
            key: "ref",
            init: () => ({
                map: new WeakMap(),
                lastId: 0,
            }),
        });
    }

    public static guessName(obj: object) {
        const tag = Obj.getStringTag(obj);

        if (tag !== "Object") {
            return tag;
        }

        const ctor = Ref.getConstructor(obj);
        if (ctor) {
            const name = ctor.name;
            if (isString(name) && name) {
                return name;
            }
        }

        return tag;
    }

    public static for(obj: object) {
        const store = ObjectRef.store;

        const map = store.map;

        if (!map.has(obj)) {
            map.set(obj, new ObjectRef(obj, ++store.lastId));
        }

        return map.get(obj)!;
    }
}
