import {IRandomSource} from "../Random";

export abstract class BufferedRandomSource implements IRandomSource {
    protected buffer: Uint8Array;
    protected index: number;

    constructor(size: number = 128) {
        this.index = size;
        this.buffer = new Uint8Array(size);
    }

    public uint8() {
        if (this.index >= this.buffer.length) {
            this.init();
            this.index = 0;
        }
        return this.buffer[this.index++];
    }

    protected abstract init(): void;
}
