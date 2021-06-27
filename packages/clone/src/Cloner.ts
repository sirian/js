import {getPrototype, getPrototypes, hasMethod, isPlainObject, isPrimitive} from "@sirian/common";
import {Instance} from "@sirian/ts-extra-types";
import {cloneSymbol} from "./Cloneable";
import {CloneContext} from "./CloneContext";
import {CloneOptions, ICloner} from "./ICloner";

export interface ICloneHandler<T> {
    create?: (src: T) => T;
    init?: (copy: T, src: T, ctx: CloneContext) => any;
}

export class Cloner implements ICloner<any> {
    public static readonly symbol: typeof cloneSymbol = cloneSymbol;

    protected handlers: Map<object, ICloneHandler<any>> = new Map();

    public constructor() {
        this.addHandler(Array, {
            create: (src) => new Array(src.length),
            init: (stub, src, ctx) => src.forEach((value, index) => ctx.cloneProperty(stub, src, index)),
        });

        const typedArrays = [
            ArrayBuffer,
            Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray,
            Int8Array, Int16Array, Int32Array,
            Float32Array, Float64Array,
        ];
        for (const target of typedArrays) {
            this.addHandler(target, {
                create: (src) => src.slice(0),
            });
        }

        for (const target of [Number, Boolean, String, Symbol, BigInt]) {
            this.addHandler(target, {
                create: (src) => src,
            });
        }

        for (const target of [RegExp, Date]) {
            this.addHandler(target, {
                create: (src) => new target(src as any),
            });
        }

        this.addHandler(DataView, {
            create: (src) => new DataView(src.buffer),
        });

        this.addHandler(Set, {
            create: () => new Set(),
            init: (copy, src, ctx) => src.forEach((item) => copy.add(ctx.clone(item))),
        });

        this.addHandler(Map, {
            create: () => new Map(),
            init: (copy, src, ctx) => src.forEach((v, k) => copy.set(ctx.clone(k), ctx.clone(v))),
        });
    }

    public static hasCloneSymbol(value: any) {
        return getPrototypes(value, {}).some((proto) => hasMethod(proto, cloneSymbol));
    }

    public supports(value: any) {
        if (isPrimitive(value) || isPlainObject(value)) {
            return true;
        }

        const proto = getPrototype(value);

        if (!proto || this.handlers.has(proto)) {
            return true;
        }

        return Cloner.hasCloneSymbol(value);
    }

    public addHandler<T extends { prototype: any }>(target: T, handler: ICloneHandler<Instance<T>>) {
        this.handlers.set(target.prototype, handler);

        return this;
    }

    public clone<T>(src: T, options: Partial<CloneOptions> = {}) {
        const ctx = new CloneContext(this, options);

        return ctx.clone(src);
    }

    public getHandler<T extends object>(src: T): ICloneHandler<T> | undefined {
        const proto = getPrototype(src);
        return this.handlers.get(proto );
    }

    public cloneDeep<T>(src: T, options: Partial<CloneOptions> = {}) {
        return this.clone(src, {maxDepth: 1 / 0, ...options});
    }
}
