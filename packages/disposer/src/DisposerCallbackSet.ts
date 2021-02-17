import {XSet, XWeakSet} from "@sirian/common";
import {DisposeCallback, Disposer} from "./Disposer";

export class DisposerCallbackSet {
    protected callbacks: XSet<DisposeCallback>;
    protected applied: XWeakSet<DisposeCallback>;
    protected disposer: Disposer;
    protected applying: boolean;

    constructor(disposer: Disposer) {
        this.applying = false;
        this.disposer = disposer;
        this.callbacks = new XSet();
        this.applied = new XWeakSet();
    }

    public apply() {
        if (!this.applying) {
            this.applying = true;
            this.callbacks.pickAll().forEach((fn) => this.handle(fn));
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
        if (this.applied.insert(callback)) {
            this.disposer.handle(callback);
        }
    }
}
