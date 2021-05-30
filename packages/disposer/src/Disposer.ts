import {isObjectOrFunction} from "@sirian/common";
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

    private readonly _before = new Set<DisposeCallback<T>>();
    private readonly _after = new Set<DisposeCallback<T>>();
    private readonly _applied = new WeakSet<DisposeCallback<T>>();
    private readonly _children = new Set<Disposer<any>>();
    private readonly _sources = new Set<Disposer<any>>();
    private _timeoutId?: Return<typeof setTimeout>;
    private _state: DisposerState = DisposerState.INITIAL;
    private readonly _manager: DisposerManager<any>;

    constructor(manager: DisposerManager<any>, target: T) {
        this.target = target;
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

        return this;
    }

    public isDisposed() {
        return this._state > DisposerState.INITIAL;
    }

    public isDisposing() {
        return this._state > DisposerState.INITIAL && this._state < DisposerState.DISPOSED;
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
            .filter(isObjectOrFunction)
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
        const self = this;

        if (DisposerState.INITIAL !== self._state) {
            return;
        }

        self._state = DisposerState.BEFORE_CHILDREN;

        self.clearTimeout();

        const target = self.target;
        self._manager.emit("dispose", target, self);

        self._before.forEach((fn) => self._handle(fn));
        self._before.clear();

        self._state = DisposerState.CHILDREN;

        self._sources.forEach((source) => source._children.delete(self));
        self._sources.clear();

        self._manager.dispose(...self._children);

        self._state = DisposerState.AFTER_CHILDREN;
        self._after.forEach((fn) => self._handle(fn));
        self._after.clear();

        self._state = DisposerState.DISPOSED;
        self._manager.emit("disposed", target, self);
    }

    private _handle(callback: DisposeCallback<T>) {
        const self = this;
        try {
            if (!self._applied.has(callback)) {
                self._applied.add(callback);
                callback(self.target, self);
            }
        } catch (e) {
            self._manager.emit("error", e, self.target, self, callback);
        }
    }
}
