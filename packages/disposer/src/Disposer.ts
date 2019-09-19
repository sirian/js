import {XSet, XWeakMap, XWeakSet} from "@sirian/common";
import {SharedStore} from "@sirian/shared-store";
import {OverloadedArgs, Return} from "@sirian/ts-extra-types";

export type DisposeCallback = (target: object) => void;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

// Ordered
const enum DisposeState {
    INITIAL,
    EXECUTE_CALLBACKS,
    DISPOSE_CHILDREN,
    DISPOSED,
}

export class Disposer {
    public readonly children: XSet<object>;
    public readonly target: object;
    public lastError?: any;
    protected state: DisposeState;
    protected callbacks: XSet<DisposeCallback>;
    protected timeoutId?: Return<typeof setTimeout>;

    protected applied: XWeakSet<DisposeCallback>;

    constructor(target: object) {
        this.state = DisposeState.INITIAL;
        this.children = new XSet();
        this.callbacks = new XSet();
        this.target = target;
        this.applied = new XWeakSet();
    }

    public static get disposers() {
        return SharedStore.get({
            key: "disposer",
            init: () => new XWeakMap<object, Disposer>(),
        });
    }

    protected static get callbacks(this: any) {
        delete this.callbacks;
        return this.callbacks = new XSet<DisposeCallback>();
    }

    public static addCallback(callback: DisposeCallback): void;
    public static addCallback(target: object, callback: DisposeCallback): void;
    public static addCallback(...args: OverloadedArgs<typeof Disposer["addCallback"]>) {
        switch (args.length) {
            case 2:
                Disposer.for(args[0]).addCallback(args[1]);
                break;
            case 1:
                Disposer.callbacks.add(args[0]);
                break;
        }
    }

    public static setTimeout<T extends object>(object: T, ms: number) {
        Disposer.for(object).setTimeout(ms);
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
        const disposers = Disposer.disposers;
        if (!disposers.has(target)) {
            const disposer = new Disposer(target);
            disposers.set(target, disposer);
            disposers.set(disposer, disposer);
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
            // noinspection JSIgnoredPromiseFromCall
            this.applyCallback(callback);
        } else {
            this.callbacks.add(callback);
        }

        return this;
    }

    public addChild(...children: [object, ...object[]]) {
        if (this.state > DisposeState.DISPOSE_CHILDREN) {
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
        Disposer.callbacks.forEach((fn) => this.applyCallback(fn));
        this.callbacks.forEach((fn) => this.applyCallback(fn));
        this.callbacks.clear();

        this.state = DisposeState.DISPOSE_CHILDREN;
        this.children.forEach((child) => Disposer.dispose(child));
        this.children.clear();

        this.state = DisposeState.DISPOSED;
    }

    protected async applyCallback(callback: DisposeCallback) {
        if (this.applied.has(callback)) {
            return;
        }
        this.applied.add(callback);
        try {
            callback(this.target);
        } catch (e) {
            this.lastError = e;
        }
    }
}
