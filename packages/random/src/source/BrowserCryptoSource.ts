import {BufferedRandomSource} from "./BufferedRandomSource";

export class BrowserCryptoSource extends BufferedRandomSource {
    protected init() {
        crypto.getRandomValues(this.buffer);
    }
}
