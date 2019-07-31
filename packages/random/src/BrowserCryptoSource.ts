import {BufferedSource} from "./BufferedSource";

export class BrowserCryptoSource extends BufferedSource {
    protected init() {
        crypto.getRandomValues(this.buffer);
    }
}
