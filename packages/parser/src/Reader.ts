export class Reader {
    public readonly source: string;
    protected pos: number;

    constructor(source: string) {
        this.source = source;
        this.pos = 0;
    }

    public get position() {
        return this.pos;
    }

    public get length() {
        return this.source.length;
    }

    public get remainingLength() {
        return this.length - this.pos;
    }

    public get current() {
        return this.source[this.pos];
    }

    public isEOF() {
        return this.pos >= this.length;
    }

    public moveForward(length = 1) {
        const pos = this.pos + length;
        this.pos = Math.min(pos, this.length);
    }

    public moveToEnd() {
        this.pos = this.length;
    }

    public indexOf(substring: string) {
        const pos = this.source.indexOf(substring, this.pos);

        if (-1 === pos) {
            return pos;
        }

        return pos - this.pos;
    }

    public match(pattern: RegExp) {
        return pattern.exec(this.getRemaining());
    }

    public getSubstring(length?: number) {
        return this.source.substr(this.pos, length);
    }

    public getRemaining() {
        return this.getSubstring();
    }

    public peekSubstring(length: number) {
        const value = this.getSubstring(length);
        this.moveForward(length);
        return value;
    }
}
