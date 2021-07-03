import {IBase64} from "./BufferBase64";

const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[\d+/A-Za-z]{4})*?(?:[\d+/A-Za-z]{2}(?:==)?|[\d+/A-Za-z]{3}=?)?$/;

export const btoa = (x: string) => {
    x = String(x);
    const len = x.length;

    let result = "";

    for (let i = 0; i < len;) {
        const a = x.charCodeAt(i++);
        const b = x.charCodeAt(i++);
        const c = x.charCodeAt(i++);

        if (a > 255 || b > 255 || c > 255) {
            throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");
        }

        const bitmap = (a << 16) | (b << 8) | c;
        result +=
            b64.charAt(bitmap >> 18 & 63)
            + b64.charAt(bitmap >> 12 & 63)
            + b64.charAt(bitmap >> 6 & 63)
            + b64.charAt(bitmap & 63);
    }

    const rest = len % 3; // To determine the final padding
    // If there's need of padding, replace the last 'A's with equal signs
    return rest
           ? result.slice(0, rest - 3) + "===".slice(Math.max(0, rest))
           : result;
};

export const atob = (x: string) => {
    // atob can work with strings with whitespaces, even inside the encoded part,
    // but only \t, \n, \f, \r and ' ', which can be stripped.
    x = String(x).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(x)) {
        throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }

    // Adding the padding if missing, for semplicity
    const length = x.length;
    x += "==".slice(2 - (length & 3));

    let result = "";
    const fromCharCode = String.fromCharCode;
    for (let i = 0; i < length;) {
        let r1;
        let r2;

        const bitmap =
            b64.indexOf(x[i++]) << 18
            | b64.indexOf(x[i++]) << 12
            | (r1 = b64.indexOf(x[i++])) << 6
            | (r2 = b64.indexOf(x[i++]));

        result += r1 === 64 ? fromCharCode(bitmap >> 16 & 255) :
                  r2 === 64 ? fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
                  fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
};

export const Polyfill1: IBase64 = {
    encode: (x) =>
        btoa(encodeURIComponent(x).replace(/%([\dA-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))),
    decode: (x) =>
        // eslint-disable-next-line unicorn/prefer-prototype-methods
        decodeURIComponent([].map.call(atob(x), (c: string) => "%" + "00".concat(c.charCodeAt(0).toString(16)).slice(-2)).join("")),
};
export const Polyfill2: IBase64 = {
    encode: (s) => btoa(unescape(encodeURIComponent(s))),
    decode: (s) => decodeURIComponent(escape(atob(s))),
};
