import {apply, construct, defineProp, getPrototypes, setPrototype, XMap, XWeakMap} from "@sirian/common";
import {ArrayValueOf, Ctor, UnionToIntersection} from "@sirian/ts-extra-types";

export type UCtor = Ctor<object>;
export type MixinFn = <C extends UCtor>(ctor: C) => C;
export type ConstructableMixin<M extends MixinFn> = M & ReturnType<M>;

export type MixinInstance<M extends MixinFn> = InstanceType<ReturnType<M>>;

export type MixinsInstance<M extends MixinFn[]> = MixinInstance<ArrayValueOf<M>>;

export type Mixified<C extends Ctor, M extends MixinFn[]> =
    C extends new (...args: infer A) => infer T
    ? new (...args: A) => T & UnionToIntersection<MixinsInstance<M>>
    : never;

export class Mixin {
    protected static readonly wrappers = new XWeakMap<MixinFn, MixinFn>();
    protected static readonly applied = new XWeakMap<object, MixinFn>();
    protected static readonly caches = new XWeakMap((superclass) => new XMap((mixin) => mixin(superclass)));

    public static create<M extends MixinFn>(mixin: M) {
        const bare = Mixin.createBareMixin(mixin);

        const {cache, deduplicate, hasInstanceWrapper} = Mixin;

        return hasInstanceWrapper(deduplicate(cache(bare)));
    }

    public static createConstructable<M extends MixinFn>(mixin: M) {
        const m = Mixin.create(mixin);

        const ctor = Mixin.applyMixin(class {}, m);

        const wrapper: any = function(this: any, ...args: any) {
            return new.target
                   ? construct(ctor, args, new.target)
                   : apply(m, this, args);
        };

        wrapper.prototype = Object.create(ctor.prototype);
        wrapper.prototype.constructor = wrapper;

        return Mixin.wrap(m, wrapper) as ConstructableMixin<M>;
    }

    public static mix<C extends Ctor, M extends MixinFn[]>(superclass: C, ...mixins: M) {
        return mixins.reduce((ctor: Ctor, mixin: MixinFn) => mixin(ctor), superclass) as Mixified<C, M>;
    }

    public static has<M extends MixinFn>(object: object, mixin: M): object is MixinInstance<M> {
        const unwrapped = Mixin.unwrap(mixin);

        return getPrototypes(object, {}).some((o) => Mixin.applied.get(o) === unwrapped);
    }

    protected static cache(mixin: MixinFn) {
        return Mixin.wrap(mixin, (superclass) => Mixin.caches.ensure(superclass).ensure(mixin) as any);
    }

    protected static deduplicate(mixin: MixinFn) {
        return Mixin.wrap(mixin, (superclass) => {
            return Mixin.has(superclass.prototype, mixin)
                   ? superclass
                   : mixin(superclass);
        });
    }

    protected static wrap(mixin: MixinFn, wrapper: MixinFn) {
        setPrototype(wrapper, mixin);

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
        return Mixin.wrappers.get(mixin) || mixin;
    }

    protected static hasInstanceWrapper<M extends MixinFn>(mixin: M) {
        const desc = {
            configurable: true,
            enumerable: false,
            writable: false,
            value: (o: object) => Mixin.has(o, mixin),
        };

        defineProp(mixin, Symbol.hasInstance, desc);

        return mixin;
    }

    protected static createBareMixin(mixin: MixinFn) {
        return Mixin.wrap(mixin, (superclass) => Mixin.applyMixin(superclass, mixin));
    }
}
