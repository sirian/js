import {Obj, Ref} from "@sirian/common";
import {ArrayElementOf, Ctor, UnionToIntersection} from "@sirian/ts-extra-types";

export type UCtor = Ctor<object>;
export type MixinFn = <C extends UCtor>(ctor: C) => C;
export type ConstructableMixin<M extends MixinFn> = M & ReturnType<M>;

export type MixinInstance<M extends MixinFn> = InstanceType<ReturnType<M>>;

export type MixinsInstance<M extends MixinFn[]> = MixinInstance<ArrayElementOf<M>>;

export type Mixified<C extends Ctor, M extends MixinFn[]> =
    C extends new (...args: infer A) => infer T
    ? new (...args: A) => T & UnionToIntersection<MixinsInstance<M>>
    : never;

export class Mixin {
    protected static readonly wrappers = new WeakMap<MixinFn, MixinFn>();
    protected static readonly applied = new WeakMap<object, MixinFn>();
    protected static readonly caches = new WeakMap<object, Map<object, Ctor>>();

    public static create<M extends MixinFn>(mixin: M) {
        const bare = Mixin.createBareMixin(mixin);

        const wrappers = [
            Mixin.cache,
            Mixin.deduplicate,
            Mixin.hasInstanceWrapper,
        ];

        return wrappers.reduce((m: MixinFn, wrapper) => wrapper(m), bare) as M;
    }

    public static createConstructable<M extends MixinFn>(mixin: M) {
        const m = this.create(mixin);

        const ctor = Mixin.applyMixin(class {}, m);

        const wrapper: any = function(this: any, ...args: any) {
            return new.target
                   ? Ref.construct(ctor, args, new.target)
                   : Ref.apply(m, this, args);
        };

        wrapper.prototype = Obj.create(ctor.prototype);
        wrapper.prototype.constructor = wrapper;

        return Mixin.wrap(m, wrapper) as ConstructableMixin<M>;
    }

    public static mix<C extends Ctor, M extends MixinFn[]>(superclass: C, ...mixins: M) {
        return mixins.reduce((ctor: Ctor, mixin: MixinFn) => mixin(ctor), superclass) as Mixified<C, M>;
    }

    public static has<M extends MixinFn>(object: object, mixin: M): object is MixinInstance<M> {
        const unwrapped = Mixin.unwrap(mixin);

        for (const o of Ref.getPrototypes(object)) {
            if (Mixin.applied.get(o) === unwrapped) {
                return true;
            }
        }

        return false;
    }

    protected static constructableWrapper<M extends MixinFn>(m: M) {

    }

    protected static cache(mixin: MixinFn) {
        return Mixin.wrap(mixin, (superclass) => {
            const caches = Mixin.caches;

            if (!caches.has(superclass)) {
                caches.set(superclass, new Map());
            }

            const cache = caches.get(superclass)!;

            if (!cache.has(mixin)) {
                cache.set(mixin, mixin(superclass));
            }

            return cache.get(mixin)! as any;
        });
    }

    protected static deduplicate(mixin: MixinFn) {
        return Mixin.wrap(mixin, (superclass) => {
            if (Mixin.has(superclass.prototype, mixin)) {
                return superclass;
            }
            return mixin(superclass);
        });
    }

    protected static wrap(mixin: MixinFn, wrapper: MixinFn) {
        Ref.setPrototype(wrapper, mixin);

        Mixin.wrappers.set(wrapper, Mixin.unwrap(mixin));

        return wrapper;
    }

    protected static applyMixin<C extends UCtor, M extends MixinFn>(superclass: C, mixin: M) {
        const res = mixin(superclass);

        const unwrapped = Mixin.unwrap(mixin);

        Mixin.applied.set(res.prototype, unwrapped);

        return res;
    }

    protected static unwrap(mixin: MixinFn) {
        const wrapper = Mixin.wrappers.get(mixin);

        return (wrapper || mixin);
    }

    protected static hasInstanceWrapper<M extends MixinFn>(mixin: M) {
        const desc = {
            configurable: true,
            enumerable: false,
            writable: false,
            value: (o: object) => Mixin.has(o, mixin),
        };

        Ref.define(mixin, Symbol.hasInstance, desc);

        return mixin;
    }

    protected static createBareMixin(mixin: MixinFn) {
        return Mixin.wrap(mixin, (superclass) => Mixin.applyMixin(superclass, mixin));
    }
}
