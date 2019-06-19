import {BufferedRandomSource} from "./BufferedRandomSource";

export class NodeCryptoSource extends BufferedRandomSource {
    protected init() {
        require("crypto").randomFill(this.buffer, this.buffer.length);
    }
}
