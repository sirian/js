import {XMap, XSet, XWeakSet} from "@sirian/common";
import {EventEmitter, StaticEventEmitter} from "@sirian/event-emitter";
import {Return} from "@sirian/ts-extra-types";

export type DisposeCallback = (target: object) => void;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

export type DisposerEvents = {
    dispose: [object, Disposer];
    disposed: [object, Disposer];
    error: [any, object, Disposer];
};

export class Disposer extends StaticEventEmitter {
    public static readonly emitter = new EventEmitter<DisposerEvents>();

    public static readonly disposers = new XMap<object, Disposer>();

    public readonly children: XSet<object>;
    public readonly target: object;

    protected disposed: boolean;
    protected callbacks: Set<DisposeCallback>;
    protected timeoutId?: Return<typeof setTimeout>;
    protected applied: XWeakSet<DisposeCallback>;

    constructor(target: object) {
        super();
        this.disposed = false;
        this.children = new XSet();
        this.callbacks = new XSet();
        this.target = target;
        this.applied = new XWeakSet();
    }

    public static addCallback(target: object, callback: DisposeCallback) {
        return Disposer.for(target).addCallback(callback);
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
        targets.forEach((target) => Disposer.for(target).dispose());
    }

    public static has(target: object) {
        return Disposer.disposers.has(target);
    }

    public static for(target: object) {
        const disposers = this.disposers;
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

    public addCallback(callback: DisposeCallback) {
        if (this.isDisposed()) {
            this.applyCallback(callback);
        } else {
            this.callbacks.add(callback);
        }

        return this;
    }

    public addChild(...children: [object, ...object[]]) {
        if (this.disposed) {
            Disposer.dispose(...children);
        } else {
            this.children.add(...children);
        }

        return this;
    }

    public addSource(...sources: [object, ...object[]]) {
        sources.forEach((source) => Disposer.for(source).addChild(this.target));
        return this;
    }

    public dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;

        this.clearTimeout();
        Disposer.emit("dispose", this.target, this);

        const {callbacks, children} = this;

        callbacks.forEach((callback) => this.applyCallback(callback));
        callbacks.clear();

        children.forEach(Disposer.dispose);
        children.clear();

        Disposer.emit("disposed", this.target, this);
    }

    protected applyCallback(callback: DisposeCallback) {
        const {target, applied} = this;

        if (applied.has(callback)) {
            return;
        }

        applied.add(callback);

        try {
            callback(target);
        } catch (e) {
            Disposer.emit("error", e, target, this);
        }
    }
}
