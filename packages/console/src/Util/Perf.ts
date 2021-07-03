import {performance} from "node:perf_hooks";

export class Perf {
    public static now() {
        return performance.now();
    }
}
