import {Benchmark} from "./Benchmark";

(async () => {
    for (let power = 1; power < 7; power++) {
        const bench = new Benchmark(10 ** power);
        await bench.run();
    }
})();
