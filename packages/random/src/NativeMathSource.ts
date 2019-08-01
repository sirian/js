import {BufferedSource} from "./BufferedSource";

export class NativeMathSource extends BufferedSource {
    constructor() {
        super(4);
    }

    public reset() {
        const view = this.view;
        for (let i = 0; i < view.byteLength; i += 4) {
            const uint32 = Math.random() * 2 ** 32;
            view.setUint32(i, uint32);
        }
    }
}
