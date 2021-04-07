import {tryCatch} from "@sirian/common";
import {DisposeCallback, Disposer} from "./Disposer";

export type DisposerEvents = {
    created: [target: object, disposer: Disposer<any>];
    dispose: [target: object, disposer: Disposer<any>];
    disposed: [target: object, disposer: Disposer<any>];
    error: [error: any, target: object, disposer: Disposer<any>, callback: DisposeCallback<any>];
};

export type DisposerEventCallback<K extends keyof DisposerEvents> = (...args: DisposerEvents[K]) => void;

export class DisposerManager<T extends object> {
    private readonly _disposers = new WeakMap<object, Disposer<any>>();
    private _listeners: { [P in keyof DisposerEvents]?: Set<DisposerEventCallback<any>> } = {};

    public onDispose<U extends T>(target: T, callback: DisposeCallback<T>) {
        return this.for(target).onDispose(callback);
    }

    public onDisposed<U extends T>(target: U, callback: DisposeCallback<U>) {
        return this.for(target).onDisposed(callback);
    }

    public addChild<U extends T>(target: U, ...children: object[]) {
        return this.for(target).addChild(...children);
    }

    public addSource<U extends T>(target: U, ...sources: object[]) {
        return this.for(target).addSource(...sources);
    }

    public isDisposed(target: T) {
        return this.has(target) && this.for(target).isDisposed();
    }

    public isDisposedFully(target: T) {
        return this.has(target) && this.for(target).isDisposedFully();
    }

    public isDisposing(target: T) {
        return this.has(target) && this.for(target).isDisposing();
    }

    public dispose(...targets: T[]) {
        targets.forEach((t) => tryCatch(() => this.for(t).dispose()));
    }

    public has(target: T) {
        return this._disposers.has(target);
    }

    public for<U extends T>(target: U) {
        const disposers = this._disposers;
        if (!disposers.has(target)) {
            const disposer = new Disposer(this, target);
            disposers.set(target, disposer);
            disposers.set(disposer, disposer);
            this.emit("created", target, disposer);
        }

        return disposers.get(target) as Disposer<U>;
    }

    public link(...targets: T[]) {
        targets.forEach((t) => this.addChild(t, ...targets));
    }

    public on<U extends keyof DisposerEvents>(event: U, callback: DisposerEventCallback<U>) {
        (this._listeners[event] ??= new Set<DisposerEventCallback<U>>()).add(callback);
    }

    public off<U extends keyof DisposerEvents>(event: U, callback: DisposerEventCallback<U>) {
        this._listeners[event]?.delete(callback);
    }

    public emit<U extends keyof DisposerEvents>(event: U, ...args: DisposerEvents[U]) {
        this._listeners[event]?.forEach((cb) => tryCatch(() => cb(...args)));
    }

    public offAll() {
        this._listeners = {};
    }
}
