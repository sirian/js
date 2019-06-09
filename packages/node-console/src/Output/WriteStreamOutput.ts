import {XSet} from "@sirian/common";
import {XPromise} from "@sirian/xpromise";
import {IOutputOptions, Output} from "./Output";
import WriteStream = NodeJS.WriteStream;

export class WriteStreamOutput extends Output {
    protected promises: XSet<XPromise<void>>;

    constructor(stream: WriteStream, options: Partial<IOutputOptions> = {}) {
        super(stream, options);

        this.promises = new XSet();
    }

    public flush() {
        return XPromise.all(this.promises.toArray());
    }

    protected doWrite(message: string) {
        const stream = this.getStream();

        const promise = new XPromise((resolve, reject) => {
            stream.write(message, (err) => err ? reject(err) : resolve());
        });

        this.promises.add(promise);

        promise.finally(() => this.promises.delete(promise));
    }
}
