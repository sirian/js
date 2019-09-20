import {BiMap} from "@sirian/common";
import {Disposer} from "./Disposer";

export class DisposableMap<K = any, V = any> extends BiMap<K, V> {
    constructor() {
        super();
        const listener = (target: any) => {
            if (target === this) {
                Disposer.removeListener("dispose", listener);
                this.clear();
                return;
            }

            this.delete(target);
            const keys = this.reverse.get(target);
            if (keys) {
                keys.forEach((key) => this.delete(key));
            }
        };

        Disposer.addListener("dispose", listener);
    }
}
