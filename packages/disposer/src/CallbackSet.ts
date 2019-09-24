import {XSet, XWeakSet} from "@sirian/common";
import {DisposeCallback, Disposer} from "./Disposer";

export class CallbackSet {
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

    public get target() {
        return this.disposer.target;
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
        const {applied, target, disposer} = this;

        if (!applied.insert(callback)) {
            return;
        }

        try {
            callback(target, disposer);
        } catch (e) {
            Disposer.emit("error", e, {callback, target, disposer});
        }
    }
}
