import {Ref, XSet, XWeakSet} from "@sirian/common";
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
    public static readonly symbol: unique symbol = Symbol.for("disposer");
    public readonly target: object;
    protected children?: XSet<object>;
    protected disposed: boolean;
    protected disposedFully: boolean;
    protected before: CallbackSet;
    protected after: CallbackSet;
    protected timeoutId?: Return<typeof setTimeout>;
    protected applied: XWeakSet<DisposeCallback>;

    constructor(target: object) {
        super();
        this.target = target;
        this.disposed = false;
        this.disposedFully = false;
        this.children = new XSet();
        this.before = new CallbackSet(this);
        this.after = new CallbackSet(this);
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

    public static addChild(target: object, ...children: object[]) {
        return Disposer.for(target).addChild(...children);
    }

    public static addSource(target: object, ...sources: object[]) {
        return Disposer.for(target).addSource(...sources);
    }

    public static isDisposed(target: object) {
        return Disposer.has(target) && Disposer.for(target).isDisposed();
    }

    public static isDisposedFully(target: object) {
        return Disposer.has(target) && Disposer.for(target).isDisposedFully();
    }

    public static isDisposing(target: object) {
        return Disposer.has(target) && Disposer.for(target).isDisposing();
    }

    public static dispose(...targets: object[]) {
        for (const target of targets) {
            Disposer.for(target).dispose();
        }
    }

    public static has(target: object) {
        return Ref.hasOwn(target, Disposer.symbol);
    }

    public static for(target: object) {
        const symbol = Disposer.symbol;

        if (!Disposer.has(target)) {
            const disposer = new Disposer(target);
            const desc: TypedPropertyDescriptor<Disposer> = {
                configurable: true,
                writable: false,
                enumerable: false,
                value: disposer,
            };

            Ref.define(target, symbol, desc);
            Ref.define(disposer, symbol, desc);
        }

        return (target as any)[symbol];
    }

    public static link(...targets: any[]) {
        for (const target of targets) {
            Disposer.addChild(target, ...targets);
        }
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

    public isDisposing() {
        return this.disposed && !this.disposedFully;
    }

    public isDisposedFully() {
        return this.disposedFully;
    }

    public onDispose(callback: DisposeCallback) {
        this.before.add(callback);
        return this;
    }

    public onDisposed(callback: DisposeCallback) {
        this.after.add(callback);

        return this;
    }

    public addChild(...children: object[]) {
        const unique = new XSet(children.map(Disposer.for));

        unique.delete(this);

        if (this.children) {
            this.children.add(...unique);
        } else {
            Disposer.dispose(...unique);
        }

        return this;
    }

    public addSource(...sources: object[]) {
        for (const source of sources) {
            Disposer.for(source).addChild(this);
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
        this.disposedFully = true;
        Disposer.emit("disposed", this.target, this);
    }
}
