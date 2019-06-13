import {TransitionBlocker} from "./TransitionBlocker";

export class TransitionBlockerList {
    protected readonly blockers: TransitionBlocker[];

    constructor(blockers: TransitionBlocker[] = []) {
        this.blockers = [...blockers];
    }

    public add(blocker: TransitionBlocker) {
        this.blockers.push(blocker);
    }

    public has(code: string) {
        return this.blockers.some((blocker) => blocker.code === code);
    }

    public clear() {
        this.blockers.length = 0;
    }

    public isEmpty() {
        return 0 === this.blockers.length;
    }
}
