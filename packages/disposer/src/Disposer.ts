import {defineProp, hasOwn} from "@sirian/common";
import {EventEmitter} from "@sirian/event-emitter";
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
    public static readonly events = new EventEmitter<DisposerEvents>();

    public readonly target: object;

    // tslint:disable:member-ordering member-access
    #before: Set<DisposeCallback>;
    #after: Set<DisposeCallback>;
    #applied: WeakSet<DisposeCallback>;
    #children: Set<Disposer>;
    #sources: Set<Disposer>;
    #timeoutId?: Return<typeof setTimeout>;
    #state: DisposerState = DisposerState.INITIAL;

    // tslint:enable

    constructor(target: object) {
        this.target = target;
        this.#applied = new WeakSet();
        this.#children = new Set();
        this.#sources = new Set();
        this.#before = new Set();
        this.#after = new Set();
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
            this.#timeoutId = setTimeout(() => this.dispose(), ms);
        }

        return this;
    }

    public clearTimeout() {
        clearTimeout(this.#timeoutId);
    }

    public isDisposed() {
        return this.#state > DisposerState.INITIAL;
    }

    public isDisposing() {
        return this.#state > DisposerState.INITIAL && !this.isDisposedFully();
    }

    public isDisposedFully() {
        return DisposerState.DISPOSED === this.#state;
    }

    public onDispose(callback: DisposeCallback) {
        if (this.#state >= DisposerState.BEFORE_CHILDREN) {
            this.handle(callback);
        } else {
            this.#before.add(callback);
        }
        return this;
    }

    public onDisposed(callback: DisposeCallback) {
        if (this.#state >= DisposerState.AFTER_CHILDREN) {
            this.handle(callback);
        } else {
            this.#after.add(callback);
        }

        return this;
    }

    public addChild(...children: object[]) {
        if (this.#state >= DisposerState.CHILDREN) {
            Disposer.dispose(...children);
            return this;
        }

        const disposers = children.map(Disposer.for);

        disposers.forEach((disposer) => {
            if (!disposer.isDisposed()) {
                this.#children.add(disposer);
                disposer.#sources.add(this);
            }
        });

        return this;
    }

    public addSource(...sources: object[]) {
        sources.forEach((source) => Disposer.addChild(source, this));
        return this;
    }

    public dispose() {
        if (DisposerState.INITIAL !== this.#state) {
            return;
        }

        this.#state = DisposerState.BEFORE_CHILDREN;
        const events = Disposer.events;

        this.clearTimeout();

        events.emit("dispose", this);

        this.#before.forEach((fn) => this.handle(fn));
        this.#before.clear();

        this.#state = DisposerState.CHILDREN;
        const sources = [...this.#sources];
        const children = [...this.#children];

        this.#sources.clear();
        this.#children.clear();

        sources.forEach((source) => source.#children.delete(this));
        children.forEach((child) => child.handle(() => child.dispose()));

        this.#state = DisposerState.AFTER_CHILDREN;
        const after = [...this.#after];
        this.#after.clear();
        after.forEach((fn) => this.handle(fn));

        this.#state = DisposerState.DISPOSED;
        events.emit("disposed", this);
    }

    private handle(callback: DisposeCallback) {
        try {
            if (!this.#applied.has(callback)) {
                this.#applied.add(callback);
                callback(this);
            }
        } catch (e) {
            Disposer.events.emit("error", e, this, callback);
        }
    }
}
