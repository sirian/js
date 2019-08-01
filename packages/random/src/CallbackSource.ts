import {IRandomSource} from "./Random";

export class CallbackSource implements IRandomSource {
    protected callback: () => number;

    constructor(callback: () => number) {
        this.callback = callback;
    }

    public nextByte() {
        return this.callback();
    }
}