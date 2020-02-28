// tslint:disable:no-console max-line-length
declare function gc(): void;

declare function encodeURIComponent(uriComponent: string | number | boolean): string;

declare function decodeURIComponent(encodedURIComponent: string): string;

const buf = require("buffer"); // tslint:disable-line:no-var-requires
const Buf = buf.Buffer;
delete buf.Buffer;

import {ByteArray, bytesToString} from "@sirian/common";
import {Base64 as JSBase64} from "js-base64";
import {base64Decode, base64Encode} from "../src";
import * as polyfill from "./polyfill";

const atob = globalThis.atob || polyfill.atob;
const btoa = globalThis.btoa || polyfill.btoa;

interface IBase64 {
    encode: (value: string) => string;
    decode: (value: string) => string;
}

(() => {
    const engines: Record<string, IBase64> = {
        "Buffer": {
            encode: (x) => Buffer.from(x).toString("base64"),
            decode: (x) => Buffer.from(x, "base64").toString(),
        },
        // "polyfill_1": {
        //     encode: (x) =>
        //         btoa(encodeURIComponent(x).replace(/%([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))),
        //     decode: (x) =>
        //         decodeURIComponent([].map.call(atob(x), (c: string) =>
        //             "%" + "00".concat(c.charCodeAt(0).toString(16)).slice(-2)).join("")),
        // },
        // "polyfill_2": {
        //     encode: (s) => btoa(unescape(encodeURIComponent(s))),
        //     decode: (s) => decodeURIComponent(escape(atob(s))),
        // },
        "js-base64": {
            encode: (x) => JSBase64.encode(x),
            decode: (x) => JSBase64.decode(x),
        },
        "Base64": {
            encode: (x) => base64Encode(ByteArray.from(x)),
            decode: (x) => bytesToString(base64Decode(x)),
        },
    };

    const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
        + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        + "Современные технологии достигли такого уровня, что синтетическое тестирование "
        + "обеспечивает широкому кругу (специалистов) участие в формировании форм воздействия.";

    const str64 = Buf.from(str).toString("base64");

    function testEngine(N: number, {encode, decode}: IBase64, enc: boolean) {
        if ("function" === typeof gc) {
            gc();
        }
        const start = Date.now();
        console.assert(str64 === encode(str));
        console.assert(str === decode(str64));

        for (let i = 0; i < N; i++) {
            enc ? encode(str) : decode(str64);
        }
        return Date.now() - start;
    }

    for (const enc of [true, false]) {
        const data: Record<number, Record<string, number>> = {};
        let maxTime = 0;
        for (let N = 500; maxTime < 1000; N *= 2) {
            const times = {};
            console.group(`Test ${enc ? "encode" : "decode"} ${N}`);

            for (const [name, engine] of Object.entries(engines)) {
                const time = testEngine(N, engine, enc);
                maxTime = Math.max(time, maxTime);
                times[name] = time;
            }
            console.groupEnd();

            data[N] = times;
        }

        console.table(data);
    }

    buf.Buffer = Buffer;
})();
