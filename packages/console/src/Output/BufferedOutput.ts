import {Stream} from "node:stream";
import {IOutputOptions, Output} from "./Output";

export class BufferedOutput extends Output {
    protected buffer: string[];

    constructor(options: Partial<IOutputOptions>) {
        const stream = new Stream.Writable({
            write: (chunk, encoding, callback) => {
                this.write(chunk);
                callback();
            },
        });

        super(stream, options);

        this.buffer = [];
    }

    public fetch() {
        return this.buffer;
    }

    public clear() {
        this.buffer.length = 0;
    }

    public flush() {}

    protected doWrite(message: string) {
        this.buffer.push(message);
    }
}
