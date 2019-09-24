import {XMap, XSet, XWeakSet} from "@sirian/common";
import {EventEmitter, StaticEventEmitter} from "@sirian/event-emitter";
import {Return} from "@sirian/ts-extra-types";
import {CallbackSet} from "./CallbackSet";

export type DisposeCallback = (target: object, disposer: Disposer) => void;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

export interface DisposeErrorDetails {
    callback: DisposeCallback;
    target: object;
    disposer: Disposer;
}

export type DisposerEvents = {
    dispose: [object, Disposer];
    disposed: [object, Disposer];
    error: [any, DisposeErrorDetails];
};

export class Disposer extends StaticEventEmitter {
    public static readonly emitter = new EventEmitter<DisposerEvents>();

    public static readonly disposers = new XMap<object, Disposer>();
    public readonly target: object;

    protected children?: XSet<object>;
    protected disposed: boolean;
    protected before: CallbackSet;
    protected after: CallbackSet;
    protected timeoutId?: Return<typeof setTimeout>;
    protected applied: XWeakSet<DisposeCallback>;

    constructor(target: object) {
        super();
        this.disposed = false;
        this.children = new XSet();
        this.before = new CallbackSet(this);
        this.after = new CallbackSet(this);
        this.target = target;
        this.applied = new XWeakSet();
    }

    public static onDispose(target: object, callback: DisposeCallback) {
        return Disposer.for(target).onDispose(callback);
    }

    public static onDisposed(target: object, callback: DisposeCallback) {
        return Disposer.for(target).onDisposed(callback);
    }

    public static setTimeout<T extends object>(object: T, ms: number) {
        return Disposer.for(object).setTimeout(ms);
    }

    public static addChild(target: object, ...children: [object, ...object[]]) {
        return Disposer.for(target).addChild(...children);
    }

    public static addSource(target: object, ...sources: [object, ...object[]]) {
        return Disposer.for(target).addSource(...sources);
    }

    public static isDisposed(target: object) {
        return Disposer.disposers.has(target) && Disposer.for(target).isDisposed();
    }

    public static dispose(...targets: object[]) {
        for (const target of targets) {
            Disposer.for(target).dispose();
        }
    }

    public static has(target: object) {
        return Disposer.disposers.has(target);
    }

    public static for(target: object) {
        const disposers = Disposer.disposers;

        if (!disposers.has(target)) {
            const disposer = new Disposer(target);
            disposers
                .set(target, disposer)
                .set(disposer, disposer);
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
        clearTimeout(this.timeoutId);
    }

    public isDisposed() {
        return this.disposed;
    }

    public onDispose(callback: DisposeCallback) {
        this.before.add(callback);
        return this;
    }

    public onDisposed(callback: DisposeCallback) {
        this.after.add(callback);

        return this;
    }

    public addChild(...children: [object, ...object[]]) {
        if (this.children) {
            this.children.add(...children);
        } else {
            Disposer.dispose(...children);
        }

        return this;
    }

    public addSource(...sources: [object, ...object[]]) {
        for (const source of sources) {
            Disposer.for(source).addChild(this.target);
        }
        return this;
    }

    public dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;

        this.clearTimeout();
        const {children} = this;

        Disposer.emit("dispose", this.target, this);

        this.before.apply();

        if (children) {
            delete this.children;
            Disposer.dispose(...children);
        }

        this.after.apply();

        Disposer.emit("disposed", this.target, this);
    }
}
