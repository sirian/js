export class Performance {
    public now: () => number;
    public timeOrigin: number;

    constructor() {
        this.timeOrigin = Date.now();
        this.now = Date.now;

        const perfHooks = (globalThis as any).perf_hooks || {};

        const targets = [
            globalThis.performance,
            perfHooks.performance,
        ];

        for (const target of targets) {
            if (null === target || "object" !== typeof target) {
                continue;
            }
            const {now, timeOrigin} = target;
            if ("function" !== now || "number" !== typeof timeOrigin) {
                continue;
            }

            this.timeOrigin = timeOrigin;
            this.now = now.bind(target);
        }
    }

    public microtime() {
        return this.timeOrigin + this.now();
    }

    public ms() {
        return Math.trunc(this.microtime());
    }
}

export const performance = new Performance();
