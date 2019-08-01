import {BufferedSource} from "./BufferedSource";

export class NodeCryptoSource extends BufferedSource {
    protected reset() {
        require("crypto").randomFillSync(this.view);
    }
}
