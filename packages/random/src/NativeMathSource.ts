import {IRandomSource} from "./Random";

export class NativeMathSource implements IRandomSource {
    public uint8() {
        return Math.trunc(256 * Math.random());
    }
}
