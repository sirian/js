import {TransitionBlocker} from "../TransitionBlocker";
import {TransitionBlockerList} from "../TransitionBlockerList";
import {WorkflowEvent} from "./WorkflowEvent";

export class GuardEvent<S extends string = any> extends WorkflowEvent<S> {
    public readonly transitionBlockerList = new TransitionBlockerList();

    public isBlocked() {
        return !this.transitionBlockerList.isEmpty();
    }

    public setBlocked(blocked: boolean) {
        if (!blocked) {
            this.transitionBlockerList.clear();
            return;
        }

        this.transitionBlockerList.add(TransitionBlocker.createUnknown());
    }

    public addTransitionBlocker(transitionBlocker: TransitionBlocker) {
        this.transitionBlockerList.add(transitionBlocker);
    }
}
