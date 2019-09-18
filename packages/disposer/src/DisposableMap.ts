import {BiMap} from "@sirian/common";
import {Disposer} from "./Disposer";

export class DisposableMap<K = any, V = any> extends BiMap<K, V> {
    constructor() {
        super();
        Disposer.addCallback((target: any) => {
            this.delete(target);

            const keys = this.reverse.get(target);

            if (keys) {
                for (const key of keys) {
                    this.delete(key);
                }
            }
        });
    }
}
