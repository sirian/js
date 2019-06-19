import {IRandomSource} from "../Random";

export class CallbackRandomSource implements IRandomSource {
    protected callback: () => number;

    constructor(callback: () => number) {
        this.callback = callback;
    }

    public uint8() {
        return this.callback();
    }
}
