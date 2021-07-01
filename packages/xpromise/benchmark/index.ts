import {entriesOf} from "@sirian/common";
import {Benchmark} from "./Benchmark";

void (async () => {
    const allResult: any = {};

    for (let power = 3; power < 7; power++) {
        const count = 10 ** power;
        const bench = new Benchmark(count);
        const results = await bench.run();
        for (const [name, time] of entriesOf(results)) {
            const key = name.padStart(20, " ");
            allResult[key] ??= {};
            allResult[key][count] = time.toString().padStart(5, " ");
        }
    }
    // tslint:disable-next-line:no-console
    console.table(allResult);
})();
