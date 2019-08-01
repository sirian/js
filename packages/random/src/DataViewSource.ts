import {ArrBuf} from "@sirian/common";
import {BufferedSource} from "./BufferedSource";

export class DataViewSource extends BufferedSource {
    protected index = 0;

    constructor(data: DataView) {
        super(data.byteLength);
        ArrBuf.set(data, this.view);
    }

    protected reset() {
    }
}
