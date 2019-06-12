import {Workflow} from "../Workflow";
import {WorkflowError} from "./WorkflowError";

export class TransitionError extends WorkflowError {
    public readonly subject: object;
    public readonly transitionName: string;
    public readonly workflow: Workflow;

    public constructor(subject: object, transitionName: string, workflow: Workflow, message: string) {
        super(message);
        this.subject = subject;
        this.transitionName = transitionName;
        this.workflow = workflow;
    }
}
