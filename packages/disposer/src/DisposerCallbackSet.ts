import {DisposeCallback, Disposer} from "./Disposer";

export class DisposerCallbackSet {
    protected callbacks: Set<DisposeCallback>;
    protected applied: WeakSet<DisposeCallback>;
    protected disposer: Disposer;
    protected applying: boolean;

    constructor(disposer: Disposer) {
        this.applying = false;
        this.disposer = disposer;
        this.callbacks = new Set();
        this.applied = new WeakSet();
    }

    public apply() {
        if (!this.applying) {
            this.applying = true;
            const callbacks = [...this.callbacks.values()];
            this.callbacks.clear();
            callbacks.forEach((fn) => this.handle(fn));
        }
    }

    public add(callback: DisposeCallback) {
        if (this.applying) {
            this.handle(callback);
        } else {
            this.callbacks.add(callback);
        }
    }

    protected handle(callback: DisposeCallback) {
        if (this.applied.add(callback)) {
            this.disposer.handle(callback);
        }
    }
}
