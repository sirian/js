import {toUint32} from "@sirian/common";

function encode(str: string): string;
function encode(str: string, n1: number, s1: string): string;
function encode(str: string, n1: number, s1: string, n2: number, s2: string): string;

function encode(str: string, ...args: []) {
    const res: Array<string | number> = [str];
    for (let i = 0; i < args.length; i += 2) {
        res.push(toUint32(args[i]), args[i + 1]);
    }
    return res.join("");
}

export const Cursor = {
    /* Common sequences */

    // Reset the terminal
    reset: () => "\u001Bc",

    /* Cursor sequences */

    saveCursor: () => "\u001B7",
    restoreCursor: () => "\u001B8",

    style: (codes: number[]) => `\u001B[${codes.join(";")}m`,
    up: (n = 1) => encode("\u001B[", n, "A"),
    down: (n = 1) => encode("\u001B[", n, "B"),
    right: (n = 1) => encode("\u001B[", n, "C"),
    left: (n = 1) => encode("\u001B[", n, "D"),
    nextLine: (n = 1) => encode("\u001B[", n, "E"),
    previousLine: (n = 1) => encode("\u001B[", n, "F"),
    cr: () => "\u000D",
    column: (n: number) => encode("\u001B[", n, "G"),
    row: (n: number) => encode("\u001B[", n, "d"),
    moveTo: (x: number, u: number) => encode("\u001B[", u, ";", x, "H"),
    showCursor: () => "\u001B[?25h",
    hideCursor: () => "\u001B[?25l",

    tabSet: () => "\u001BH",
    tabClear: () => "\u001B[0g",
    tabClearAll: () => "\u001B[3g",
    forwardTab: (n = 1) => encode("\u001B[", n, "I"),
    backwardTab: (n = 1) => encode("\u001B[", n, "Z"),

    // Cursor styles
    blockCursor: () => "\u001B[2 q",
    blinkingBlockCursor: () => "\u001B[0 q",
    underlineCursor: () => "\u001B[4 q",
    blinkingUnderlineCursor: () => "\u001B[3 q",
    beamCursor: () => "\u001B[6 q",
    blinkingBeamCursor: () => "\u001B[5 q",

    /* Editing sequences */

    clear: () => "\u001B[H\u001B[2J",
    eraseDisplayBelow: () => "\u001B[0J",
    eraseDisplayAbove: () => "\u001B[1J",
    eraseDisplay: () => "\u001B[2J",
    eraseSavedLine: () => "\u001B[3J",
    eraseLineAfter: () => "\u001B[0K",
    eraseLineBefore: () => "\u001B[1K",
    eraseLine: () => "\u001B[2K",
    insertLine: (n = 1) => encode("\u001B[", n, "L"),
    deleteLine: (n = 1) => encode("\u001B[", n, "M"),
};
