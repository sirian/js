import {BaseEvent} from "@sirian/event-dispatcher";

export class ErrorEvent<E = any> extends BaseEvent {
    protected error: E;

    constructor(error: E) {
        super();
        this.error = error;
    }
}
