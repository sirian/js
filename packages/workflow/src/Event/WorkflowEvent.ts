import {Event} from "@sirian/event-dispatcher";
import {Marking} from "../Marking";
import {Transition} from "../Transition";
import {Workflow} from "../Workflow";

interface WorkflowEventInit<S extends string = any> {
    subject: object;
    marking: Marking<S>;
    transition: Transition<S>;
    workflow: Workflow<S>;
}

export class WorkflowEvent<S extends string = any> extends Event {
    public readonly subject: object;
    public readonly marking: Marking<S>;
    public readonly transition: Transition<S>;
    public readonly workflow: Workflow;

    constructor({subject, marking, transition, workflow}: WorkflowEventInit<S>) {
        super();
        this.subject = subject;
        this.marking = marking;
        this.transition = transition;
        this.workflow = workflow;
    }
}
