import {Obj, Ref, Var, XMap} from "@sirian/common";
import {cloneSymbol} from "./Cloneable";
import {CloneError} from "./CloneError";
import {Cloner, ICloneHandler} from "./Cloner";
import {CloneOptions} from "./ICloner";

export class CloneContext {
    protected stack: object[];
    protected map: XMap<any, any>;
    protected cloner: Cloner;
    protected maxDepth: number;
    protected bypass: (object: object, ctx: CloneContext) => boolean;

    constructor(cloner: Cloner, options: Partial<CloneOptions> = {}) {
        const {maxDepth = 0, bypass = () => false} = options;
        this.maxDepth = maxDepth;
        this.bypass = bypass;

        if (!(maxDepth >= 0)) {
            throw new CloneError("Cloner.clone option maxDepth should be >= 0");
        }

        this.cloner = cloner;
        this.map = new XMap();
        this.stack = [];
    }

    public get depth() {
        return this.stack.length;
    }

    public clone<T>(src: T) {
        return this.doClone(src);
    }

    public cloneProperties<T extends object>(copy: T, src: T) {
        for (const key of Ref.ownKeys(src)) {
            this.cloneProperty(copy, src, key);
        }
    }

    public addProperties<T extends object>(copy: T, src: T) {
        for (const key of Ref.ownKeys(src)) {
            this.addProperty(copy, src, key);
        }
    }

    public addProperty<T extends object, K extends keyof T>(copy: T, src: T, key: K) {
        if (!Ref.has(copy, key)) {
            this.cloneProperty(copy, src, key);
        }
    }

    public cloneProperty<T extends object, K extends keyof T>(copy: T, src: T, key: K) {
        const descriptor = Ref.ownDescriptor(src, key);

        if (!descriptor) {
            delete copy[key];
            return;
        }

        const value = descriptor.value;
        if (!Var.isPrimitive(value)) {
            descriptor.value = this.clone(value);
        }

        Ref.define(copy, key, descriptor);
    }

    protected doClone<T>(src: T): T {
        if (!Var.isObject(src) || this.depth > this.maxDepth) {
            return src;
        }

        if (!this.cloner.supports(src)) {
            if (this.bypass(src, this)) {
                return src;
            }
            throw new CloneError(`Could not clone ${Obj.getStringTag(src)} - provide bypass option to copy as-is`);
        }

        const map = this.map;

        if (map.has(src)) {
            return map.get(src) as T;
        }

        this.stack.push(src);

        try {
            const handler = this.cloner.getHandler(src);

            const stub = this.createStub(src, handler);

            map.set(src, stub);

            this.initStub(stub, src, handler);

            return stub as T;
        } finally {
            this.stack.pop();
        }

    }

    protected initStub<T extends object>(stub: T, src: T, handler?: ICloneHandler<T>) {
        if (!Var.isObject(stub) || src === stub) {
            return;
        }

        if (Ref.hasMethod(handler, "init")) {
            handler.init(stub, src, this);
        }

        this.addProperties(stub, src);

        if (Ref.hasMethod(stub, cloneSymbol)) {
            stub[cloneSymbol]();
        }
    }

    protected createStub<T extends object>(src: T, handler?: ICloneHandler<T>): T {
        const proto = Ref.getPrototype(src);

        if (!proto || !Ref.hasMethod(handler, "create")) {
            return Obj.create(proto) as T;
        }

        const stub = handler.create(src);

        Ref.setPrototype(stub, proto);

        return stub;
    }
}
