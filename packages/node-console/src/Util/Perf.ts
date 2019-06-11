import {performance} from "perf_hooks";

export class Perf {
    public static now() {
        return performance.now();
    }
}
