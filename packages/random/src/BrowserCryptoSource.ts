import {BufferedSource} from "./BufferedSource";

export class BrowserCryptoSource extends BufferedSource {
    protected reset() {
        crypto.getRandomValues(this.view);
    }
}
