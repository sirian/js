import {Workflow} from "../../src";
import {TestWorkflowFactory} from "../TestWorkflowFactory";

test("CanWithUnexistingTransition", () => {
    const definition = TestWorkflowFactory.createComplexWorkflowDefinition();
    const subject: any = {};
    const workflow = new Workflow({definition});

    expect(workflow.can(subject, "foobar")).toBe(false);
});

test("Can", () => {
    const definition = TestWorkflowFactory.createComplexWorkflowDefinition();
    const subject: any = {};

    const workflow = new Workflow({definition});

    expect(workflow.can(subject, "t1")).toBe(true);
    expect(workflow.can(subject, "t2")).toBe(false);

    subject.marking = {b: 1};

    expect(workflow.can(subject, "t1")).toBe(false);
    // In a workflow net, all "from" places should contain a token to enable
    // the transition.
    expect(workflow.can(subject, "t2")).toBe(false);

    subject.marking = {b: 1, c: 1};

    expect(workflow.can(subject, "t1")).toBe(false);
    expect(workflow.can(subject, "t2")).toBe(true);

    subject.marking = {f: 1};

    expect(workflow.can(subject, "t5")).toBe(false);
    expect(workflow.can(subject, "t6")).toBe(true);
});

test("CanWithGuard", () => {
    const definition = TestWorkflowFactory.createComplexWorkflowDefinition();
    const subject: any = {};

    const workflow = new Workflow({
        definition,
        name: "workflow_name",
    });

    expect(workflow.can(subject, "t1")).toBe(true);

    workflow.onGuard.addListener((event) => {
        event.setBlocked("t1" === event.transition.name);
    });

    expect(workflow.can(subject, "t1")).toBe(false);
});

test("CanDoesNotTriggerGuardEventsForNotEnabledTransitions", () => {
    const definition = TestWorkflowFactory.createComplexWorkflowDefinition();
    const subject: any = {};

    const dispatchedEvents: any[] = [];

    const workflow = new Workflow({
        definition,
        name: "workflow_name",
    });
    workflow.apply(subject, "t1");
    workflow.apply(subject, "t2");

    workflow.onGuard.addListener((event) => {
        dispatchedEvents.push(event.transition.name);
    });

    workflow.can(subject, "t3");

    expect(dispatchedEvents).toStrictEqual(["t3"]);
});

test("CanWithSameNameTransition", () => {
    const definition = TestWorkflowFactory.createWorkflowWithSameNameTransition();
    const workflow = new Workflow({
        definition,
    });

    const subject: any = {};

    expect(workflow.can(subject, "a_to_bc")).toBe(true);
    expect(workflow.can(subject, "b_to_c")).toBe(false);
    expect(workflow.can(subject, "to_a")).toBe(false);

    subject.marking = {b: 1};
    expect(workflow.can(subject, "a_to_bc")).toBe(false);
    expect(workflow.can(subject, "b_to_c")).toBe(true);
    expect(workflow.can(subject, "to_a")).toBe(true);
});
