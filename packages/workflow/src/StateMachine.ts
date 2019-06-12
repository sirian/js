import {SingleStateMarkingStore} from "./MarkingStore";
import {Workflow, WorkflowInit} from "./Workflow";

export class StateMachine<S extends string> extends Workflow<S> {
    constructor(init: WorkflowInit<S>) {
        const opts = {
            name: "unnamed",
            ...init,
        };

        if (!opts.markingStore) {
            opts.markingStore = new SingleStateMarkingStore("marking");
        }

        super(opts);
    }
}
