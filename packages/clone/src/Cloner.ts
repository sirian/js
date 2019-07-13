import {Obj, Ref, Var} from "@sirian/common";
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

    public static readonly defaultCloner = new Cloner();

    protected handlers: Map<object, ICloneHandler<any>>;

    public constructor() {
        this.handlers = new Map();

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
                create: (src) => Obj.wrap(Obj.toPrimitive(src)),
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

    public static supports(target: any) {
        return this.defaultCloner.supports(target);
    }

    public static clone<T>(target: T, options: Partial<CloneOptions> = {}): T {
        return this.defaultCloner.clone(target, options);
    }

    public static cloneDeep<T>(target: T, options: Partial<CloneOptions> = {}): T {
        return this.defaultCloner.cloneDeep(target, options);
    }

    public static hasCloneSymbol(value: any) {
        for (const proto of Ref.getProtoChain(value)) {
            if (Ref.hasMethod(proto, cloneSymbol)) {
                return true;
            }
        }
        return false;
    }

    public supports(value: any) {
        if (Var.isPrimitive(value)) {
            return true;
        }
        if (Var.isPlainObject(value)) {
            return true;
        }

        const proto = Ref.getPrototypeOf(value);

        if (this.handlers.has(proto)) {
            return true;
        }

        if (Cloner.hasCloneSymbol(value)) {
            return true;
        }

        return false;
    }

    public addHandler<T extends { prototype: any }>(target: T, handler: ICloneHandler<Instance<T>>) {
        this.handlers.set(target.prototype, handler);

    }

    public clone<T>(src: T, options: Partial<CloneOptions> = {}) {
        const ctx = new CloneContext(this, options);

        return ctx.clone(src);
    }

    public getHandler<T extends object>(src: T): ICloneHandler<T> | undefined {
        const proto = Ref.getPrototypeOf(src);
        return this.handlers.get(proto);
    }

    public cloneDeep<T>(src: T, options: Partial<CloneOptions> = {}) {
        return this.clone(src, {maxDepth: 1 / 0, ...options});
    }
}

export const clone = Cloner.clone.bind(Cloner);
export const cloneDeep = Cloner.cloneDeep.bind(Cloner);
