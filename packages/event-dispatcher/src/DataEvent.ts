import {Event} from "./Event";

export class DataEvent<T = any> extends Event {
    public readonly data: T;

    constructor(data: T) {
        super();
        this.data = data;
    }
}
