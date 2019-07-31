import {BufferedSource} from "./BufferedSource";

export class NodeCryptoSource extends BufferedSource {
    protected init() {
        require("crypto").randomFillSync(this.buffer, this.buffer.length);
    }
}
