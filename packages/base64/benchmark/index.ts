/* eslint-disable @typescript-eslint/no-var-requires,unicorn/prefer-module */

import {toUTF} from "@sirian/common";
import {base64Decode, base64Encode} from "../src";
import {BufferBase64, IBase64} from "./BufferBase64";

const Buf = global.Buffer;
Reflect.deleteProperty(global, "Buffer");

const engines: Record<string, IBase64> = {
    "Buffer": BufferBase64,
    // "polyfill1": Polyfill1,
    // "polyfill2": Polyfill2,
    "@sirian/base64": {
        encode: base64Encode,
        decode: (x) => toUTF(base64Decode(x)),
    },

    "js-base64": require("js-base64").Base64,
    "base-64": require("base-64"),
};

global.Buffer = Buf;

function testEngine(N: number, engine: IBase64, method: "encode" | "decode", value: string, expected: string) {
    const fn = engine[method].bind(engine, value);
    const start = Date.now();
    for (let i = 0; i < N; i++) {
        const result = fn();
        if (expected !== result) {
            throw new Error("String mismatch at sample " + i);
        }
    }
    return Date.now() - start;
}

const strings = [
    "",
    "foo bar",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    "Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞😹🐶😹🐶💩𝌆",
];

for (const str of strings) {
    for (const method of ["encode", "decode"] as const) {
        const str64 = BufferBase64.encode(str);
        const [value, expected] = "encode" === method ? [str, str64] : [str64, str];

        console.log("%s(%o)", method, value);

        const data: Record<number, Record<string, number>> = {};
        let maxTime = 0;
        for (let N = 2000; maxTime < 1000; N *= 2) {
            const times: Record<string, any> = {};
            for (const [name, engine] of Object.entries(engines)) {
                try {
                    const time = testEngine(N, engine, method, value, expected);
                    maxTime = Math.max(time, maxTime);
                    times[name] = time;
                } catch (e) {
                    times[name] = e.message;
                }
            }

            data[N] = times;
        }

        console.table(data);
    }
}
