import {IRandomSource} from "./Random";

export abstract class BufferedSource implements IRandomSource {
    protected view: DataView;
    protected index: number;

    constructor(bufferSize: number = 128) {
        const buffer = new ArrayBuffer(bufferSize);
        this.view = new DataView(buffer);
        this.index = 0;
    }

    public nextByte() {
        const {index, view} = this;
        if (0 === index) {
            this.reset();
        }
        this.index = (index + 1) % view.byteLength;

        return view.getUint8(index);
    }

    protected abstract reset(): void;
}
