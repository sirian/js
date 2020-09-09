// tslint:disable:no-console max-line-length
declare function gc(): void;

declare function require(x: string): any;

declare const console: any;

declare function encodeURIComponent(uriComponent: string | number | boolean): string;

declare function decodeURIComponent(encodedURIComponent: string): string;

import {assert} from "@sirian/assert";
import {Obj} from "@sirian/common";
import {Base64} from "../src";

const Buf = (globalThis as any).Buffer;
delete (globalThis as any).Buffer;

interface IBase64 {
    encode: (value: string) => string;
    decode: (value: string) => string;
}

(() => {
    const engines: Record<string, IBase64> = {
        "Buffer": {
            encode: (x) => Buf.from(x).toString("base64"),
            decode: (x) => Buf.from(x, "base64").toString(),
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
        "js-base64": require("js-base64").Base64,
        "base-64": require("base-64"),
        "@sirian/base64": {
            encode: (x) => Base64.encode(x, true),
            decode: (x) => Base64.decode(x, true),
        },
    };

    function testEngine(N: number, {encode, decode}: IBase64, enc: boolean) {
        if ("function" === typeof gc) {
            gc();
        }

        const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
            + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            + "Современные технологии достигли такого уровня, что синтетическое тестирование "
            + "обеспечивает широкому кругу (специалистов) участие в формировании форм воздействия.";

        const str64 = Buf.from(str).toString("base64");

        if (enc) {
            assert(str64 === encode(str));
        } else {
            assert(str === decode(str64));
        }
        const start = Date.now();
        for (let i = 0; i < N; i++) {
            enc ? encode(str) : decode(str64);
        }
        return Date.now() - start;
    }

    for (const enc of [true, false]) {
        const data: Record<number, Record<string, number>> = {};
        let maxTime = 0;
        for (let N = 500; maxTime < 500; N *= 2) {
            const times: Record<string, any> = {};
            console.group(`Test ${enc ? "encode" : "decode"} ${N}`);

            for (const [name, engine] of Obj.entries(engines)) {
                try {
                    const time = testEngine(N, engine, enc);
                    maxTime = Math.max(time, maxTime);
                    times[name] = time;
                } catch (e) {
                    times[name] = e.message;
                }
            }
            console.groupEnd();

            data[N] = times;
        }

        console.table(data);
    }
})();
