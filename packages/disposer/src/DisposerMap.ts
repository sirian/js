import {XWeakMap} from "@sirian/common";
import {Disposer} from "./Disposer";

export class DisposerMap extends XWeakMap<object, Disposer> {
    constructor() {
        super((target) => {
            const disposer = new Disposer(target);
            this.set(disposer, disposer);
            return disposer;
        });
    }
}
