import {Ref, XSet} from "@sirian/common";
import {SharedStore} from "@sirian/shared-store";
import {Return} from "@sirian/ts-extra-types";

export type DisposeCallback = () => void;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

// Ordered
enum DisposeState {
    INITIAL = 0,
    EXECUTE_CALLBACKS = 1,
    DISPOSE_CHILDREN = 2,
    DISPOSED = 3,
}

export class Disposer {
    public readonly children: XSet<object>;
    public readonly errors: any[] = [];

    protected state: DisposeState;
    protected callbacks: DisposeCallback[];
    protected timeoutId?: Return<typeof setTimeout>;

    constructor() {
        this.state = DisposeState.INITIAL;
        this.children = new XSet();
        this.callbacks = [];
    }

    public static get store() {
        return SharedStore.get({
            key: "disposer",
            init: () => ({
                disposers: new WeakMap<object, Disposer>(),
                targets: new WeakMap<Disposer, object>(),
            }),
        });
    }

    protected static get disposers() {
        return this.store.disposers;
    }

    public get target() {
        return Disposer.store.targets.get(this);
    }

    public static addCallback(target: object, callback: DisposeCallback) {
        Disposer.for(target).addCallback(callback);
    }

    public static setTimeout<T extends object>(object: T, ms: number) {
        Disposer.for(object).setTimeout(ms);
    }

    public static once<F extends (...args: any[]) => any>(fn: F) {
        const {proxy, revoke} = Proxy.revocable(fn, {
            apply(target, thisArg, args) {
                try {
                    return Ref.apply(fn, thisArg, args);
                } finally {
                    Disposer.dispose(proxy);
                }
            },
        });

        Disposer.for(proxy).addSource(fn).addCallback(revoke);

        return proxy;
    }

    public static addChild(target: object, ...children: [object, ...object[]]) {
        Disposer.for(target).addChild(...children);
    }

    public static isDisposed(target: object) {
        if (!Disposer.disposers.has(target)) {
            return false;
        }

        return Disposer.for(target).isDisposed();
    }

    public static dispose(...targets: object[]) {
        for (const target of targets) {
            Disposer.for(target).dispose();
        }
    }

    public static for(target: object) {
        const store = Disposer.store;
        const disposers = store.disposers;

        if (!disposers.has(target)) {
            const disposer = new Disposer();
            disposers.set(target, disposer);
            disposers.set(disposer, disposer);
            store.targets.set(disposer, target);
        }

        return disposers.get(target)!;
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

        if (this.state > DisposeState.EXECUTE_CALLBACKS) {
            this.applyCallback(callback);
        } else {
            this.callbacks.push(callback);
        }

        return this;
    }

    public addChild(...children: [object, ...object[]]) {
        if (this.state >= DisposeState.DISPOSE_CHILDREN) {
            Disposer.dispose(...children);
        } else {
            this.children.add(...children);
        }

        return this;
    }

    public addSource(...sources: [object, ...object[]]) {
        for (const source of sources) {
            Disposer.addChild(source, this);
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
        Disposer.dispose(...this.children);
        this.children.clear();
    }

    protected applyCallbacks() {
        const callbacks = this.callbacks;
        while (callbacks.length) {
            this.applyCallback(callbacks.shift()!);
        }
    }

    protected applyCallback(callback: DisposeCallback) {
        try {
            callback();
        } catch (e) {
            this.errors.push(e);
        }
    }
}
