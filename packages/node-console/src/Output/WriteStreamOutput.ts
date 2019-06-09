import {IOutputOptions, Output} from "./Output";
import WriteStream = NodeJS.WriteStream;

export class WriteStreamOutput extends Output {
    protected promises: Set<Promise<any>>;

    constructor(stream: WriteStream, options: Partial<IOutputOptions> = {}) {
        super(stream, options);

        this.promises = new Set();
    }

    public flush() {
        return Promise.all([...this.promises]);
    }

    protected doWrite(message: string) {
        const stream = this.getStream();

        const promise = new Promise((resolve, reject) => {
            stream.write(message, (err) => err ? reject(err) : resolve());
        });

        this.promises.add(promise);

        promise.finally(() => this.promises.delete(promise));
    }
}
