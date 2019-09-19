import {BiMap} from "@sirian/common";
import {Disposer} from "./Disposer";

export class DisposableMap<K = any, V = any> extends BiMap<K, V> {
    constructor() {
        super();
        const listener = (target: any) => {
            this.delete(target);
            const keys = this.reverse.get(target);
            if (keys) {
                keys.forEach((key) => this.delete(key));
            }
        };

        Disposer.events.addListener("dispose", listener);
        Disposer.addCallback(this, () => Disposer.events.removeListener("dispose", listener));
    }
}
