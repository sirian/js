import {defineProp, hasOwn} from "@sirian/common";
import {MultiDispatcher} from "@sirian/event-dispatcher";
import {Return} from "@sirian/ts-extra-types";

export type DisposeCallback = (disposer: Disposer) => void;

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

export type DisposerEvents = {
    created: [Disposer];
    dispose: [Disposer];
    disposed: [Disposer];
    error: [any, Disposer, DisposeCallback?];
};

export const disposerSymbol: unique symbol = Symbol.for("disposer");

const enum DisposerState {
    INITIAL,
    BEFORE_CHILDREN,
    CHILDREN,
    AFTER_CHILDREN,
    DISPOSED,
}

export class Disposer {
    public static readonly events = new MultiDispatcher<DisposerEvents>();

    public readonly target: object;

    private readonly _before: Set<DisposeCallback>;
    private readonly _after: Set<DisposeCallback>;
    private readonly _applied: WeakSet<DisposeCallback>;
    private readonly _children: Set<Disposer>;
    private readonly _sources: Set<Disposer>;
    private _timeoutId?: Return<typeof setTimeout>;
    private _state: DisposerState = DisposerState.INITIAL;

    constructor(target: object) {
        this.target = target;
        this._applied = new WeakSet();
        this._children = new Set();
        this._sources = new Set();
        this._before = new Set();
        this._after = new Set();
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
        targets.forEach((t) => Disposer.for(t).dispose());
    }

    public static has(target: object): target is Record<typeof disposerSymbol, Disposer> {
        return hasOwn(target, disposerSymbol);
    }

    public static for(target: object) {
        if (Disposer.has(target)) {
            return target[disposerSymbol];
        }

        const disposer = new Disposer(target);

        const desc: TypedPropertyDescriptor<Disposer> = {
            configurable: true,
            writable: false,
            enumerable: false,
            value: disposer,
        };

        defineProp(target, disposerSymbol, desc);
        defineProp(disposer, disposerSymbol, desc);
        Disposer.events.emit("created", disposer);
        return disposer;
    }

    public static link(...targets: any[]) {
        targets.forEach((t) => Disposer.addChild(t, ...targets));
    }

    public setTimeout(ms: number) {
        this.clearTimeout();

        if (!this.isDisposed()) {
            this._timeoutId = setTimeout(() => this.dispose(), ms);
        }

        return this;
    }

    public clearTimeout() {
        clearTimeout(this._timeoutId);
    }

    public isDisposed() {
        return this._state > DisposerState.INITIAL;
    }

    public isDisposing() {
        return this._state > DisposerState.INITIAL && !this.isDisposedFully();
    }

    public isDisposedFully() {
        return DisposerState.DISPOSED === this._state;
    }

    public onDispose(callback: DisposeCallback) {
        if (this._state >= DisposerState.BEFORE_CHILDREN) {
            this._handle(callback);
        } else {
            this._before.add(callback);
        }
        return this;
    }

    public onDisposed(callback: DisposeCallback) {
        if (this._state >= DisposerState.AFTER_CHILDREN) {
            this._handle(callback);
        } else {
            this._after.add(callback);
        }

        return this;
    }

    public addChild(...children: object[]) {
        if (this._state >= DisposerState.CHILDREN) {
            Disposer.dispose(...children);
            return this;
        }

        const disposers = children.map(Disposer.for);

        disposers.forEach((disposer) => {
            if (!disposer.isDisposed()) {
                this._children.add(disposer);
                disposer._sources.add(this);
            }
        });

        return this;
    }

    public addSource(...sources: object[]) {
        sources.forEach((source) => Disposer.addChild(source, this));
        return this;
    }

    public dispose() {
        if (DisposerState.INITIAL !== this._state) {
            return;
        }

        this._state = DisposerState.BEFORE_CHILDREN;
        const events = Disposer.events;

        this.clearTimeout();

        events.emit("dispose", this);

        this._before.forEach((fn) => this._handle(fn));
        this._before.clear();

        this._state = DisposerState.CHILDREN;
        const sources = [...this._sources];
        const children = [...this._children];

        this._sources.clear();
        this._children.clear();

        sources.forEach((source) => source._children.delete(this));
        children.forEach((child) => child._handle(() => child.dispose()));

        this._state = DisposerState.AFTER_CHILDREN;
        const after = [...this._after];
        this._after.clear();
        after.forEach((fn) => this._handle(fn));

        this._state = DisposerState.DISPOSED;
        events.emit("disposed", this);
    }

    private _handle(callback: DisposeCallback) {
        try {
            if (!this._applied.has(callback)) {
                this._applied.add(callback);
                callback(this);
            }
        } catch (e) {
            Disposer.events.emit("error", e, this, callback);
        }
    }
}
