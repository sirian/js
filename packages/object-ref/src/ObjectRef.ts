import {Obj, Ref} from "@sirian/common";
import {SharedStore} from "@sirian/shared-store";

export class ObjectRef {
    public readonly target: object;
    public readonly id: number;
    public readonly name: string;

    protected constructor(target: object, id: number) {
        this.target = target;

        this.id = id;
        this.name = ObjectRef.guessName(target) + "#" + id;
    }

    public static get store() {
        return SharedStore.get("@sirian/object-ref", () => Obj.assign(new WeakMap(), {
            count: 0,
        }));
    }

    public static guessName(obj: object) {
        const tag = Obj.getStringTag(obj);

        if (tag !== "Object") {
            return tag;
        }

        const ctor = Ref.getConstructor(obj);
        return ctor ? ctor.name : tag;
    }

    public static for(obj: object) {
        const {store} = this;
        if (!store.has(obj)) {
            store.set(obj, new ObjectRef(obj, ++store.count));
        }
        return store.get(obj)!;
    }
}
