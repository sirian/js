import {XSet, XWeakMap, XWeakSet} from "@sirian/common";
import {EventEmitter} from "@sirian/event-emitter";
import {SharedStore} from "@sirian/shared-store";
import {Return} from "@sirian/ts-extra-types";

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

export class Disposer {
    public readonly children: XSet<object>;
    public readonly target: object;
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

    public static get events(this: any) {
        delete this.events;
        return this.events = new EventEmitter<DisposerEvents>();
    }

    public static get disposers() {
        return SharedStore.get({
            key: "disposer",
            init: () => new XWeakMap<object, Disposer>(),
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
        Disposer.events.emit("dispose", this.target, this);
        this.callbacks.forEach((fn) => this.applyCallback(fn));
        this.callbacks.clear();

        this.state = DisposeState.DISPOSE_CHILDREN;
        this.children.forEach((child) => Disposer.dispose(child));
        this.children.clear();

        this.state = DisposeState.DISPOSED;
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
            Disposer.events.emit("error", e, target, this);
        }
    }
}
