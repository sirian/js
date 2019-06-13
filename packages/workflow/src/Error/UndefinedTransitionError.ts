import {Workflow} from "../Workflow";
import {TransitionError} from "./TransitionError";

export class UndefinedTransitionError extends TransitionError {
    public constructor(subject: object, transitionName: string, workflow: Workflow) {
        const message = `Transition "${transitionName}" is not defined for workflow "${workflow.name}"`;
        super(subject, transitionName, workflow, message);
    }
}
