import {Num} from "@sirian/common";

function encode(str: string): string;
function encode(str: string, n1: number, s1: string): string;
function encode(str: string, n1: number, s1: string, n2: number, s2: string): string;

function encode(str: string, ...args: []) {
    const res: Array<string | number> = [str];
    for (let i = 0; i < args.length; i += 2) {
        res.push(Num.toUint32(args[i]), args[i + 1]);
    }
    return res.join("");
}

export const ESC = {
    /* Common sequences */

    // Reset the terminal
    reset: () => "\x1bc",

    /* Cursor sequences */

    saveCursor: () => "\x1b7",
    restoreCursor: () => "\x1b8",

    style: (codes: number[]) => `\x1b[${codes.join(";")}m`,
    up: (n = 1) => encode("\x1b[", n, "A"),
    down: (n = 1) => encode("\x1b[", n, "B"),
    right: (n = 1) => encode("\x1b[", n, "C"),
    left: (n = 1) => encode("\x1b[", n, "D"),
    nextLine: (n = 1) => encode("\x1b[", n, "E"),
    previousLine: (n = 1) => encode("\x1b[", n, "F"),
    cr: () => "\x0D",
    column: (n: number) => encode("\x1b[", n, "G"),
    row: (n: number) => encode("\x1b[", n, "d"),
    moveTo: (x: number, u: number) => encode("\x1b[", u, ";", x, "H"),
    showCursor: () => "\x1b[?25h",
    hideCursor: () => "\x1b[?25l",

    tabSet: () => "\x1bH",
    tabClear: () => "\x1b[0g",
    tabClearAll: () => "\x1b[3g",
    forwardTab: (n = 1) => encode("\x1b[", n, "I"),
    backwardTab: (n = 1) => encode("\x1b[", n, "Z"),

    // Cursor styles
    blockCursor: () => "\x1b[2 q",
    blinkingBlockCursor: () => "\x1b[0 q",
    underlineCursor: () => "\x1b[4 q",
    blinkingUnderlineCursor: () => "\x1b[3 q",
    beamCursor: () => "\x1b[6 q",
    blinkingBeamCursor: () => "\x1b[5 q",

    /* Editing sequences */

    clear: () => "\x1b[H\x1b[2J",
    eraseDisplayBelow: () => "\x1b[0J",
    eraseDisplayAbove: () => "\x1b[1J",
    eraseDisplay: () => "\x1b[2J",
    eraseSavedLine: () => "\x1b[3J",
    eraseLineAfter: () => "\x1b[0K",
    eraseLineBefore: () => "\x1b[1K",
    eraseLine: () => "\x1b[2K",
    insertLine: (n = 1) => encode("\x1b[", n, "L"),
    deleteLine: (n = 1) => encode("\x1b[", n, "M"),
};
