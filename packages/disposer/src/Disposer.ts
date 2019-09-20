import {XSet, XWeakSet} from "@sirian/common";
import {StaticEventEmitter} from "@sirian/event-emitter";
import {SharedStore} from "@sirian/shared-store";
import {Return} from "@sirian/ts-extra-types";
import {DisposerMap} from "./DisposerMap";

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

export type DisposerEvents = {
    dispose: [object, Disposer];
    error: [any, object, Disposer];
};

export class Disposer extends StaticEventEmitter {

    public readonly children: XSet<object>;
    public readonly target: object;
    protected state: DisposeState;
    protected callbacks: Set<DisposeCallback>;
    protected timeoutId?: Return<typeof setTimeout>;
    protected applied: XWeakSet<DisposeCallback>;

    constructor(target: object) {
        super();
        this.state = DisposeState.INITIAL;
        this.children = new XSet();
        this.callbacks = new XSet();
        this.target = target;
        this.applied = new XWeakSet();
    }

    public static getDisposers(this: any) {
        return this.disposers = this.disposers || SharedStore.get({
            key: "disposer",
            init: () => new DisposerMap(),
        });
    }

    public static addCallback(target: object, callback: DisposeCallback) {
        Disposer.for(target).addCallback(callback);
    }

    public static setTimeout<T extends object>(object: T, ms: number) {
        Disposer.for(object).setTimeout(ms);
    }

    public static addChild(target: object, ...children: [object, ...object[]]) {
        Disposer.for(target).addChild(...children);
    }

    public static isDisposed(target: object) {
        if (!Disposer.getDisposers().has(target)) {
            return false;
        }

        return Disposer.for(target).isDisposed();
    }

    public static dispose(...targets: object[]) {
        const disposers = Disposer.getDisposers();
        for (const target of targets) {
            const disposer = disposers.get(target);
            if (disposer) {
                disposer.dispose();
            }
        }
    }

    public static has(target: object) {
        return Disposer.getDisposers().has(target);
    }

    public static for(target: object) {
        return Disposer.getDisposers().ensure(target);
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
        } else {
            this.callbacks.add(callback);
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

    protected applyCallbacks() {
        Disposer.emit("dispose", this.target, this);
        for (const fn of this.callbacks) {
            this.applyCallback(fn);
        }
        this.callbacks.clear();
    }

    protected applyCallback(callback: DisposeCallback) {
        if (this.applied.has(callback)) {
            return;
        }

        this.applied.add(callback);
        const {target} = this;

        try {
            callback(target);
        } catch (e) {
            Disposer.emit("error", e, target, this);
        }
    }

    protected disposeChildren() {
        for (const child of this.children) {
            Disposer.dispose(child);
        }
        this.children.clear();
    }
}
