import {Event} from "../src";

export class TestEventListener {
    public preFooInvoked = false;
    public postFooInvoked = false;

    public preFoo(e: Event) {
        this.preFooInvoked = true;
    }

    public postFoo(e: Event) {
        this.postFooInvoked = true;
        e.stopPropagation();
    }
}
