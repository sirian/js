import {Console} from "./handlers";

declare const console: Console;

export function debug(...args: any[]) {
    console.log(...args);
}
