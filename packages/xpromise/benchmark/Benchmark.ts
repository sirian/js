import {XPromise} from "../src";

declare const console: any;
declare const gc: any;
declare const process: any;

// tslint:disable:no-console
export class Benchmark {
    protected count: number;

    constructor(count: number) {
        this.count = count;
    }

    public async run() {
        console.log("Count: %d", this.count);

        const cb = (value: number) => value + 1;
        const cba = async (value: number) => {
            await null;
            return value + 1;
        };

        await this.test("SyncLoop", async () => {
            let result = 0;
            for (let i = 0; i < this.count; i++) {
                result = result + 1;
            }
            return result;
        });

        await this.test("AsyncLoop (cb)", async () => {
            let result = 0;
            for (let i = 0; i < this.count; i++) {
                result = await cb(result);
            }
            return result;
        });

        await this.test("AsyncLoop (cba)", async () => {
            let result = 0;
            for (let i = 0; i < this.count; i++) {
                result = await cba(result);
            }
            return result;
        });

        await this.test("AsyncLoop (cb) chk", async () => {
            let result: any = 0;
            for (let i = 0; i < this.count; i++) {
                result = cb(result);

                if (result && "function" === typeof result.then) {
                    result = await result;
                }
            }
            return result;
        });

        await this.test("AsyncLoop (cba) chk", async () => {
            let result: any = 0;
            for (let i = 0; i < this.count; i++) {
                result = cba(result);

                if (result && "function" === typeof result.then) {
                    result = await result;
                }
            }
            return result;
        });

        await this.test("Callback", () => {
            let res = 0;
            for (let i = 0; i < this.count; i++) {
                res = cb(res);
            }
            return res;
        });

        await this.test("Promise(cb)", () => {
            let promise = Promise.resolve(0);
            for (let i = 0; i < this.count; i++) {
                promise = promise.then(cb);
            }
            return promise;
        });

        await this.test("Promise(cba)", () => {
            let promise = Promise.resolve(0);
            for (let i = 0; i < this.count; i++) {
                promise = promise.then(cba);
            }
            return promise;
        });

        await this.test("XPromise(cb)", () => {
            let promise = XPromise.resolve(0);
            for (let i = 0; i < this.count; i++) {
                promise = promise.then(cb);
            }
            return promise;
        });

        await this.test("XPromise(cba)", () => {
            let promise = XPromise.resolve(0);
            for (let i = 0; i < this.count; i++) {
                promise = promise.then(cba);
            }
            return promise;
        });

        console.log();
    }

    protected async test(name: string, fn: () => any) {
        if ("undefined" !== typeof gc) {
            gc();
        }
        const before = process.memoryUsage().heapUsed / 1024 / 1024;
        const start = Date.now();
        const result = await fn();
        const time = Date.now() - start;

        if ("undefined" !== typeof gc) {
            gc();
        }
        const after = process.memoryUsage().heapUsed / 1024 / 1024;

        console.assert(result === this.count, name);

        console.log("%s\t%s ms. Memory: %s => %s", name.padEnd(20), time.toString().padStart(5), before.toFixed(2), after.toFixed(2));
    }
}
