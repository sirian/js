import {Obj} from "@sirian/common";
import {EventDispatcher} from "@sirian/event-dispatcher";
import {Definition} from "./Definition";
import {NotEnabledTransitionError, UndefinedTransitionError} from "./Error";
import {GuardEvent, WorkflowEvent} from "./Event";
import {Marking} from "./Marking";
import {MultipleStateMarkingStore} from "./MarkingStore";
import {Transition} from "./Transition";
import {TransitionBlockCode, TransitionBlocker} from "./TransitionBlocker";
import {TransitionBlockerList} from "./TransitionBlockerList";
import {MarkingStoreInterface} from "./workflow-types";

export interface WorkflowInit<S extends string> {
    definition: Definition<S>;
    markingStore?: MarkingStoreInterface<S>;
    name?: string;
}

export class Workflow<S extends string = any> {
    public readonly definition: Definition<S>;
    public readonly markingStore: MarkingStoreInterface<S>;
    public readonly name: string;

    public onGuard = new EventDispatcher<GuardEvent>();
    public onLeave = new EventDispatcher<WorkflowEvent>();
    public onTransition = new EventDispatcher<WorkflowEvent>();
    public onEnter = new EventDispatcher<WorkflowEvent>();
    public onEntered = new EventDispatcher<WorkflowEvent>();
    public onCompleted = new EventDispatcher<WorkflowEvent>();
    public onAnnounce = new EventDispatcher<WorkflowEvent>();

    constructor({definition, markingStore, name = "unnamed"}: WorkflowInit<S>) {
        this.definition = definition;
        this.markingStore = markingStore || new MultipleStateMarkingStore("marking");
        this.name = name;
    }

    public getMarking<T extends object>(subject: T) {
        const marking = this.markingStore.getMarking(subject);

        // check if the subject is already in the workflow
        if (marking.isEmpty()) {
            const initialPlace = this.definition.initialPlace;

            if (!initialPlace) {
                throw new Error(`The Marking is empty and there is no initial place for workflow "${this.name}".`);
            }

            marking.mark(initialPlace);

            // update the subject with the new marking
            this.markingStore.setMarking(subject, marking);
        }

        // check that the subject has a known place
        const places = this.definition.places;

        for (const place of Obj.keys(marking.getPlaces())) {
            if (places.has(place)) {
                continue;
            }

            let message = `Place "${place}" is not valid for workflow "${this.name}".`;

            if (!places.size) {
                message += " It seems you forgot to add places to the current workflow.";
            }

            throw new Error(message);
        }

        return marking;
    }

    public can(subject: object, transitionName: string) {
        const transitions = this.definition.transitions;
        const marking = this.getMarking(subject);

        for (const transition of transitions) {
            if (transition.name !== transitionName) {
                continue;
            }

            const transitionBlockerList = this.buildTransitionBlockerListForTransition(subject, marking, transition);

            if (transitionBlockerList.isEmpty()) {
                return true;
            }
        }

        return false;
    }

    public buildTransitionBlockerList(subject: object, transitionName: S) {
        const transitions = this.definition.transitions;
        const marking = this.getMarking(subject);
        let transitionBlockerList;

        for (const transition of transitions) {
            if (transition.name !== transitionName) {
                continue;
            }

            transitionBlockerList = this.buildTransitionBlockerListForTransition(subject, marking, transition);

            if (transitionBlockerList.isEmpty()) {
                return transitionBlockerList;
            }

            // We prefer to return transitions blocker by something else than
            // marking. Because it means the marking was OK. Transitions are
            // deterministic: it's not possible to have many transitions enabled
            // at the same time that match the same marking with the same name
            if (!transitionBlockerList.has(TransitionBlockCode.BY_MARKING)) {
                return transitionBlockerList;
            }
        }

        if (!transitionBlockerList) {
            throw new UndefinedTransitionError(subject, transitionName, this);
        }

        return transitionBlockerList;
    }

    public apply(subject: object, transitionName: S, context: object = {}) {
        const marking = this.getMarking(subject);

        let transitionBlockerList;
        let applied = false;
        const approvedTransitionQueue = [];

        for (const transition of this.definition.transitions) {
            if (transition.name !== transitionName) {
                continue;
            }

            transitionBlockerList = this.buildTransitionBlockerListForTransition(subject, marking, transition);
            if (!transitionBlockerList.isEmpty()) {
                continue;
            }
            approvedTransitionQueue.push(transition);
        }

        for (const transition of approvedTransitionQueue) {
            applied = true;

            this.leave(subject, transition, marking);

            this.transition(subject, transition, marking);

            this.enter(subject, transition, marking);

            this.markingStore.setMarking(subject, marking, context);

            this.entered(subject, transition, marking);

            this.completed(subject, transition, marking);

            this.announce(subject, transition, marking);
        }

        if (!transitionBlockerList) {
            throw new UndefinedTransitionError(subject, transitionName, this);
        }

        if (!applied) {
            throw new NotEnabledTransitionError(subject, transitionName, this, transitionBlockerList);
        }

        return marking;
    }

    public getEnabledTransitions(subject: object) {
        const enabledTransitions = [];
        const marking = this.getMarking(subject);

        for (const transition of this.definition.transitions) {
            const transitionBlockerList = this.buildTransitionBlockerListForTransition(subject, marking, transition);
            if (transitionBlockerList.isEmpty()) {
                enabledTransitions.push(transition);
            }
        }

        return enabledTransitions;
    }

    private buildTransitionBlockerListForTransition(subject: object, marking: Marking, transition: Transition) {
        for (const place of transition.froms) {
            if (!marking.has(place)) {
                return new TransitionBlockerList([
                    TransitionBlocker.createBlockedByMarking(marking),
                ]);
            }
        }

        const event = this.guardTransition(subject, marking, transition)!;

        if (event.isBlocked()) {
            return event.transitionBlockerList;
        }

        return new TransitionBlockerList();
    }

    private guardTransition(subject: object, marking: Marking, transition: Transition): GuardEvent | undefined {
        const event = new GuardEvent({subject, marking, transition, workflow: this});

        this.onGuard.dispatchSync(event);

        return event;
    }

    private leave(subject: object, transition: Transition, marking: Marking) {
        const places = transition.froms;

        const event = new WorkflowEvent({subject, marking, transition, workflow: this});
        this.onLeave.dispatchSync(event);

        for (const place of places) {
            marking.unmark(place);
        }
    }

    private transition(subject: object, transition: Transition, marking: Marking) {
        const event = new WorkflowEvent({subject, marking, transition, workflow: this});

        this.onTransition.dispatchSync(event);
    }

    private enter(subject: object, transition: Transition, marking: Marking): void {
        const places = transition.tos;

        const event = new WorkflowEvent({subject, marking, transition, workflow: this});
        this.onEnter.dispatchSync(event);

        for (const place of places) {
            marking.mark(place);
        }
    }

    private entered(subject: object, transition: Transition, marking: Marking) {
        const event = new WorkflowEvent({subject, marking, transition, workflow: this});

        this.onEntered.dispatchSync(event);
    }

    private completed(subject: object, transition: Transition, marking: Marking) {
        const event = new WorkflowEvent({subject, marking, transition, workflow: this});

        this.onCompleted.dispatchSync(event);
    }

    private announce(subject: object, initialTransition: Transition, marking: Marking) {
        const event = new WorkflowEvent({
            subject,
            marking,
            transition: initialTransition,
            workflow: this,
        });

        this.onAnnounce.dispatchSync(event);
    }
}
