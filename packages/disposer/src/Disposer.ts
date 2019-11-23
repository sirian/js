import {Ref, XSet} from "@sirian/common";
import {EventEmitter, StaticEventEmitter} from "@sirian/event-emitter";
import {Return} from "@sirian/ts-extra-types";
import {DisposerCallbackSet} from "./DisposerCallbackSet";

export type DisposeCallback = (disposer: Disposer) => void;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

export type DisposerEvents = {
    dispose: [Disposer];
    disposed: [Disposer];
    error: [any, Disposer, DisposeCallback?];
};

export class Disposer extends StaticEventEmitter {
    public static readonly emitter = new EventEmitter<DisposerEvents>();
    public static readonly symbol: unique symbol = Symbol.for("disposer");
    public readonly target: object;
    protected children: XSet<Disposer>;
    protected sources: XSet<Disposer>;
    protected disposed: boolean;
    protected disposedFully: boolean;
    protected before: DisposerCallbackSet;
    protected after: DisposerCallbackSet;
    protected timeoutId?: Return<typeof setTimeout>;

    constructor(target: object) {
        super();
        this.target = target;
        this.disposed = false;
        this.disposedFully = false;
        this.children = new XSet();
        this.sources = new XSet();
        this.before = new DisposerCallbackSet(this);
        this.after = new DisposerCallbackSet(this);
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

        return (target as any)[symbol] as Disposer;
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
        const disposers = children.map((child) => Disposer.for(child));
        if (this.disposed) {
            disposers.forEach((d) => d.dispose());
        } else {
            for (const disposer of disposers) {
                if (disposer.disposed) {
                    continue;
                }

                this.children.add(disposer);
                disposer.sources.add(this);
            }

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

        const sources = this.sources.pickAll();
        const children = this.children.pickAll();

        for (const source of sources) {
            source.children.delete(this);
        }

        Disposer.emit("dispose", this);

        this.before.apply();

        for (const child of children) {
            try {
                child.dispose();
            } catch (e) {
                Disposer.emit("error", e, child);
            }
        }

        this.after.apply();
        this.disposedFully = true;
        Disposer.emit("disposed", this);
    }
}
