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
        if (this.applying) {
            return;
        }
        this.applying = true;
        this.callbacks.pickAll().forEach((fn) => this.applyCallback(fn));
    }

    public add(callback: DisposeCallback) {
        if (this.applying) {
            this.applyCallback(callback);
        } else {
            this.callbacks.add(callback);
        }
    }

    protected applyCallback(callback: DisposeCallback) {
        const {applied, disposer} = this;

        if (!applied.insert(callback)) {
            return;
        }

        try {
            callback(disposer);
        } catch (e) {
            Disposer.emit("error", e, disposer, callback);
        }
    }
}
