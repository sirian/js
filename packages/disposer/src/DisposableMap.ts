import {BiMap} from "@sirian/common";
import {Disposer} from "./Disposer";

export class DisposableMap<K = any, V = any> extends BiMap<K, V> {
    constructor() {
        super();

        const listener = (disposer: Disposer) => {
            const target = disposer.target as any;

            if (target === this) {
                Disposer.removeListener("disposed", listener);
                this.clear();
                return;
            }

            this.delete(target);
            const keys = this.reverse.get(target);
            keys?.forEach((key) => this.delete(key));
        };

        Disposer.on("disposed", listener);
    }
}
