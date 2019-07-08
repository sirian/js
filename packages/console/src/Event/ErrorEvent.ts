import {Event} from "@sirian/event-dispatcher";

export class ErrorEvent<E = any> extends Event {
    protected error: E;

    constructor(error: E) {
        super();
        this.error = error;
    }
}
