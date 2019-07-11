declare function gc(): void;

// tslint:disable-next-line:no-var-requires
const buf = require("buffer");
const Buf = buf.Buffer;
delete buf.Buffer;

import {Base64 as JSBase64} from "js-base64";
import {Base64, IBase64Engine} from "../src";

type Engine = Pick<IBase64Engine, "encode" | "decode">;

(() => {
    const engines: Record<string, Engine> = {
        "Buffer": {
            encode: (x) => Buffer.from(x).toString("base64"),
            decode: (x) => Buffer.from(x, "base64").toString(),
        },
        "js-base64": JSBase64,
        "Base64": Base64,
    };

// tslint:disable:no-console max-line-length

    const str = "Sed ut perspiciatis, unde omnis iste natus ";

    const str64 = Buf.from(str).toString("base64");

    function testEngine(N: number, b64Engine: Engine) {
        if ("function" === typeof gc) {
            gc();
        }
        const start = Date.now();
        for (let i = 0; i < N; i++) {
            console.assert(str64 === b64Engine.encode(str));
            console.assert(str === b64Engine.decode(str64));
        }
        return Date.now() - start;
    }

    const data: Record<number, Record<string, number>> = {};

    for (let i = 3; i < 7; i++) {
        const N = 10 ** i;
        const times = {};
        console.group(`Test ${N}`);

        for (const [name, engine] of Object.entries(engines)) {
            const time = testEngine(N, engine);
            times[name] = time;
            console.log(name, time);
        }
        console.groupEnd();

        data[N] = times;
    }
    buf.Buffer = Buffer;
    console.table(data);
})();