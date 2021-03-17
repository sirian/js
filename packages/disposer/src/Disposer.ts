import {Return} from "@sirian/ts-extra-types";
import {DisposerManager} from "./DisposerManager";

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

export type DisposeCallback<T extends object> = (target: T, disposer: Disposer<T>) => void;

const enum DisposerState {
    INITIAL,
    BEFORE_CHILDREN,
    CHILDREN,
    AFTER_CHILDREN,
    DISPOSED,
}

export class Disposer<T extends object> {
    public readonly target: T;

    private readonly _before: Set<DisposeCallback<T>>;
    private readonly _after: Set<DisposeCallback<T>>;
    private readonly _applied: WeakSet<DisposeCallback<T>>;
    private readonly _children: Set<Disposer<any>>;
    private readonly _sources: Set<Disposer<any>>;
    private _timeoutId?: Return<typeof setTimeout>;
    private _state: DisposerState = DisposerState.INITIAL;
    private readonly _manager: DisposerManager;

    constructor(manager: DisposerManager, target: T) {
        this.target = target;
        this._applied = new WeakSet();
        this._children = new Set();
        this._sources = new Set();
        this._before = new Set();
        this._after = new Set();
        this._manager = manager;
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

    public onDispose(callback: DisposeCallback<T>) {
        if (this._state >= DisposerState.BEFORE_CHILDREN) {
            this._handle(callback);
        } else {
            this._before.add(callback);
        }
        return this;
    }

    public onDisposed(callback: DisposeCallback<T>) {
        if (this._state >= DisposerState.AFTER_CHILDREN) {
            this._handle(callback);
        } else {
            this._after.add(callback);
        }

        return this;
    }

    public addChild(...children: object[]) {
        if (this._state >= DisposerState.CHILDREN) {
            this._manager.dispose(...children);
            return this;
        }

        children
            .map((c) => this._manager.for(c))
            .filter((d) => !d.isDisposed())
            .forEach((disposer) => {
                this._children.add(disposer);
                disposer._sources.add(this);
            });

        return this;
    }

    public addSource(...sources: object[]) {
        sources.forEach((source) => this._manager.addChild(source, this));
        return this;
    }

    public dispose() {
        if (DisposerState.INITIAL !== this._state) {
            return;
        }

        this._state = DisposerState.BEFORE_CHILDREN;

        this.clearTimeout();

        const target = this.target;
        this._manager.emit("dispose", target, this);

        this._before.forEach((fn) => this._handle(fn));
        this._before.clear();

        this._state = DisposerState.CHILDREN;

        this._sources.forEach((source) => source._children.delete(this));
        this._sources.clear();

        this._manager.dispose(...this._children);

        this._state = DisposerState.AFTER_CHILDREN;
        this._after.forEach((fn) => this._handle(fn));
        this._after.clear();

        this._state = DisposerState.DISPOSED;
        this._manager.emit("disposed", target, this);
    }

    private _handle(callback: DisposeCallback<T>) {
        try {
            if (!this._applied.has(callback)) {
                this._applied.add(callback);
                callback(this.target, this);
            }
        } catch (e) {
            this._manager.emit("error", e, this.target, this, callback);
        }
    }
}
