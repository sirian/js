import {BaseEvent} from "../src";

export class TestEventListener {
    public preFooInvoked = false;
    public postFooInvoked = false;

    public preFoo(e: BaseEvent) {
        this.preFooInvoked = true;
    }

    public postFoo(e: BaseEvent) {
        this.postFooInvoked = true;
        e.stopPropagation();
    }
}
