export type DisposeCallback = () => void;

// Ordered
enum DisposeState {
    INITIAL = 0,
    EXECUTE_CALLBACKS = 1,
    DISPOSE_CHILDREN = 2,
    DISPOSED = 3,
}

export class Disposer {
    public readonly children: Set<object>;
    public readonly target: object;

    protected state: DisposeState;
    protected callbacks: Set<DisposeCallback>;
    protected initiator?: object;
    protected timeoutId?: ReturnType<typeof setTimeout>;

    constructor(target: object) {
        this.target = target;
        this.state = DisposeState.INITIAL;
        this.children = new Set();
        this.callbacks = new Set();
    }

    public static addCallback(target: object, callback: DisposeCallback) {
        Disposer.for(target).addCallback(callback);
    }

    public static setTimeout<T extends object>(ms: number, object: T) {
        Disposer.for(object).setTimeout(ms);
        return object;
    }

    public static once<F extends (...args: any[]) => any>(fn: F) {
        const wrapper = new Proxy(fn, {
            apply: (target, thisArg, args) => {
                Disposer.assertNotDisposed(target, wrapper);

                try {
                    return target.apply(thisArg, args);
                } finally {
                    Disposer.dispose(wrapper);
                }
            },
        });

        return wrapper;
    }

    public static addChild(target: object, ...child: [object, ...object[]]) {
        Disposer.for(target).addChild(...child);
    }

    public static assertNotDisposed(...objects: [object, ...object[]]) {
        for (const object of objects) {
            if (this.isDisposed(object)) {
                throw new Error(`Object disposed "${object}"`);
            }
        }
    }

    public static isDisposed(target: object) {
        if (!this.getMap().has(target)) {
            return false;
        }

        return this.for(target).isDisposed();
    }

    public static dispose(target: object) {
        this.for(target).dispose();
    }

    public static for(target: object) {
        const disposers = this.getMap();

        if (!disposers.has(target)) {
            const disposer = new Disposer(target);
            disposers.set(target, disposer);
            disposers.set(disposer, disposer);
        }

        return disposers.get(target)!;
    }

    protected static getMap(): WeakMap<object, Disposer> {
        const target: any = Symbol;
        const key = Symbol.for("@sirian/disposer");
        if (!target[key]) {
            Reflect.defineProperty(target, key, {
                configurable: true,
                writable: false,
                enumerable: false,
                value: new WeakMap(),
            });
        }

        return target[key];
    }

    public setTimeout(ms: number) {
        this.clearTimeout();

        if (!this.isDisposed()) {
            this.timeoutId = setTimeout(() => this.dispose(), ms);
        }

        return this;
    }

    public clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    public isDisposed() {
        return DisposeState.INITIAL !== this.state;
    }

    public addCallback(callback: DisposeCallback) {
        if (this.state >= DisposeState.EXECUTE_CALLBACKS) {
            this.applyCallback(callback);
            return this;
        }

        this.callbacks.add(callback);

        return this;
    }

    public addChild(...children: [object, ...object[]]) {
        for (const child of children) {
            if (this.state >= DisposeState.DISPOSE_CHILDREN) {
                this.disposeChild(child);
            } else {
                this.children.add(child);
            }
        }

        return this;
    }

    public addSource(...sources: [object, ...object[]]) {
        for (const source of sources) {
            Disposer.for(source).addChild(this);
        }

        return this;
    }

    public dispose() {
        if (DisposeState.INITIAL !== this.state) {
            return;
        }
        this.clearTimeout();

        this.state = DisposeState.EXECUTE_CALLBACKS;
        this.applyCallbacks();

        this.state = DisposeState.DISPOSE_CHILDREN;
        this.disposeChildren();

        this.state = DisposeState.DISPOSED;
    }

    protected disposeChildren() {

        const children = [...this.children];
        this.children.clear();

        for (const child of children) {
            this.disposeChild(child);
        }
    }

    protected disposeChild(child: object) {
        const childDisposer = Disposer.for(child);
        childDisposer.initiator = this;
        childDisposer.dispose();
    }

    protected applyCallbacks() {
        const callbacks = [...this.callbacks];
        this.callbacks.clear();

        for (const callback of callbacks) {
            this.applyCallback(callback);
        }
    }

    protected applyCallback(callback: DisposeCallback) {
        try {
            callback();
        } catch (e) {
            // todo
        }
    }
}
