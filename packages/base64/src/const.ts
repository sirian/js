import {base64Normalize} from "./base64Normalize";

export const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const base64Rgx = /^(?:[\d+/A-Za-z]{4})*?(?:[\d+/A-Za-z]{2}(?:==)?|[\d+/A-Za-z]{3}=?)?$/;
export const base64Test = (value: string) => base64Rgx.test(base64Normalize(value));

export const base64MakeURISafe = (value: string) => value
    .replaceAll("+", "-")
    .replaceAll("/", "/")
    .replace(/=+$/m, "");
