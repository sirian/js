import {
    defineProp,
    getObjectTag,
    getPrototype,
    hasMethod,
    hasProp,
    isObject,
    isPrimitive,
    ownDescriptor,
    ownKeys,
    setPrototype,
} from "@sirian/common";
import {cloneSymbol} from "./Cloneable";
import {CloneError} from "./CloneError";
import {Cloner, ICloneHandler} from "./Cloner";
import {CloneOptions} from "./ICloner";

export class CloneContext {
    private readonly stack: object[];
    private readonly map: Map<any, any>;
    private readonly cloner: Cloner;
    private readonly maxDepth: number;
    private readonly bypass: (object: object, ctx: CloneContext) => boolean;

    constructor(cloner: Cloner, options: Partial<CloneOptions> = {}) {
        this.maxDepth = options.maxDepth ?? 0;
        this.bypass = options.bypass ?? (() => false);
        this.cloner = cloner;
        this.map = new Map();
        this.stack = [];
    }

    public get depth() {
        return this.stack.length;
    }

    public clone<T>(src: T) {
        return this.doClone(src);
    }

    public cloneProperties<T extends object>(copy: T, src: T) {
        for (const key of ownKeys(src)) {
            this.cloneProperty(copy, src, key);
        }
    }

    public addProperties<T extends object>(copy: T, src: T) {
        for (const key of ownKeys(src)) {
            this.addProperty(copy, src, key);
        }
    }

    public addProperty<T extends object, K extends keyof T>(copy: T, src: T, key: K) {
        if (!hasProp(copy, key)) {
            this.cloneProperty(copy, src, key);
        }
    }

    public cloneProperty<T extends object, K extends keyof T>(copy: T, src: T, key: K) {
        const descriptor = ownDescriptor(src, key);

        if (!descriptor) {
            delete copy[key];
            return;
        }

        const value = descriptor.value;
        if (!isPrimitive(value)) {
            descriptor.value = this.clone(value);
        }

        defineProp(copy, key, descriptor);
    }

    protected doClone<T>(src: T): T {
        if (!isObject(src) || this.depth > this.maxDepth) {
            return src;
        }

        if (!this.cloner.supports(src)) {
            if (this.bypass(src, this)) {
                return src;
            }
            throw new CloneError(`Could not clone ${getObjectTag(src)} - provide bypass option to copy as-is`);
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
        if (!isObject(stub) || src === stub) {
            return;
        }

        if (hasMethod(handler, "init")) {
            handler.init(stub, src, this);
        }

        this.addProperties(stub, src);

        if (hasMethod(stub, cloneSymbol)) {
            stub[cloneSymbol]();
        }
    }

    protected createStub<T extends object>(src: T, handler?: ICloneHandler<T>): T {
        const proto = getPrototype(src);

        if (!proto || !hasMethod(handler, "create")) {
            return Object.create(proto ?? null) as T;
        }

        const stub = handler.create(src);

        setPrototype(stub, proto);

        return stub;
    }
}
