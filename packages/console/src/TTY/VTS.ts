import {toUint32} from "@sirian/common";

export const ESC = "\u001B";
export const CSI = ESC + "[";

export class VTS {
    private buffer: string[] = [];

    push(...strings: string[]) {
        this.buffer.push(...strings);
        return this;
    }

    csi(fn: string, ...x: number[]) {
        return this.push(CSI, x.map((v) => toUint32(v)).join(";"), fn);
    }

    esc(...s: string[]) {
        this.push(ESC, ...s);
    }

    reset() { return this.esc("c"); }

    saveCursor() { return this.esc("7"); }

    restoreCursor() { return this.esc("8"); }

    tabSet() { return this.esc("H"); }

    showCursor() { return this.push(CSI, "?25h"); }

    hideCursor() { return this.push(CSI, "?25l"); }

    cr() { return this.push("\u000D") }

    style(codes: number[]) { return this.csi("m", ...codes); }

    up(n = 1) { return this.csi("A", n); }

    down(n = 1) { return this.csi("B", n); }

    right(n = 1) { return this.csi("C", n); }

    left(n = 1) { return this.csi("D", n); }

    nextLine(n = 1) { return this.csi("E", n); }

    previousLine(n = 1) { return this.csi("F", n); }

    column(n: number) { return this.csi("G", n); }

    row(n: number) { return this.csi("d", n); }

    moveTo(x: number, u: number) { return this.csi("H", u, x); }


    tabClear() { return this.csi("g", 0); }

    tabClearAll() { return this.csi("g", 3); }

    forwardTab(n = 1) { return this.csi("I", n); }

    backwardTab(n = 1) { return this.csi("Z", n); }

    clear() { return this.csi("H").csi("J", 2); }

    eraseDisplayBelow() { return this.csi("J", 0); }

    eraseDisplayAbove() { return this.csi("J", 1); }

    eraseDisplay() { return this.csi("J", 2); }

    eraseSavedLine() { return this.csi("J", 3); }

    eraseLineAfter() { return this.csi("K", 0); }

    eraseLineBefore() { return this.csi("K", 1); }

    eraseLine() { return this.csi("K", 2); }

    insertLine(n = 1) { return this.csi("L", n); }

    deleteLine(n = 1) { return this.csi("M", n); }

    toString() {
        return this.buffer.join("");
    }
}
