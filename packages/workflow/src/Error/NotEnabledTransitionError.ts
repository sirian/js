import {TransitionBlockerList} from "../TransitionBlockerList";
import {Workflow} from "../Workflow";
import {TransitionError} from "./TransitionError";

export class NotEnabledTransitionError extends TransitionError {
    public readonly transitionBlockerList: TransitionBlockerList;

    constructor(subject: object, transactionName: string, workflow: Workflow, list: TransitionBlockerList) {
        const message = `Transition "${transactionName}" is not enabled for workflow "${workflow.name}".`;
        super(subject, transactionName, workflow, message);
        this.transitionBlockerList = list;
    }
}
