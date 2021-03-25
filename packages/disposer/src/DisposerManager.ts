import {DisposeCallback, Disposer} from "./Disposer";

export type DisposerEvents = {
    created: [target: object, disposer: Disposer<any>];
    dispose: [target: object, disposer: Disposer<any>];
    disposed: [target: object, disposer: Disposer<any>];
    error: [error: any, target: object, disposer: Disposer<any>, callback: DisposeCallback<any>];
};

export type DisposerEventCallback<K extends keyof DisposerEvents> = (...args: DisposerEvents[K]) => void;

export class DisposerManager<D extends object = object> {
    private readonly _disposers = new WeakMap<object, Disposer<any>>();
    private _listeners: { [P in keyof DisposerEvents]?: Set<DisposerEventCallback<any>> } = {};

    public onDispose<T extends D>(target: T, callback: DisposeCallback<T>) {
        return this.for(target).onDispose(callback);
    }

    public onDisposed<T extends D>(target: T, callback: DisposeCallback<T>) {
        return this.for(target).onDisposed(callback);
    }

    public setTimeout<T extends D>(target: T, ms: number) {
        return this.for(target).setTimeout(ms);
    }

    public addChild<T extends D>(target: T, ...children: object[]) {
        return this.for(target).addChild(...children);
    }

    public addSource<T extends D>(target: T, ...sources: object[]) {
        return this.for(target).addSource(...sources);
    }

    public isDisposed(target: D) {
        return this.has(target) && this.for(target).isDisposed();
    }

    public isDisposedFully(target: D) {
        return this.has(target) && this.for(target).isDisposedFully();
    }

    public isDisposing(target: D) {
        return this.has(target) && this.for(target).isDisposing();
    }

    public dispose(...targets: D[]) {
        targets.forEach((t) => this.for(t).dispose());
    }

    public has(target: D) {
        return this._disposers.has(target);
    }

    public for<T extends D>(target: T) {
        const disposers = this._disposers;
        if (!disposers.has(target)) {
            const disposer = new Disposer(this, target);
            disposers.set(target, disposer);
            disposers.set(disposer, disposer);
            this.emit("created", target, disposer);
        }

        return disposers.get(target) as Disposer<T>;
    }

    public link(...targets: D[]) {
        targets.forEach((t) => this.addChild(t, ...targets));
    }

    public on<T extends keyof DisposerEvents>(event: T, callback: DisposerEventCallback<T>) {
        (this._listeners[event] ??= new Set<DisposerEventCallback<T>>()).add(callback);
    }

    public off<T extends keyof DisposerEvents>(event: T, callback: DisposerEventCallback<T>) {
        this._listeners[event]?.delete(callback);
    }

    public emit<T extends keyof DisposerEvents>(event: T, ...args: DisposerEvents[T]) {
        for (const cb of this._listeners[event] ?? []) {
            try {
                cb(...args);
            } catch (e) {
            }
        }
    }

    public offAll() {
        this._listeners = {};
    }
}
