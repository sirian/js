import {Marking} from "./Marking";

export const enum TransitionBlockCode {
    BY_MARKING = "marking",
    BY_EXPRESSION_GUARD_LISTENER = "expression_guard_listener",
    UNKNOWN = "unknown",
}

export class TransitionBlocker {
    public readonly message: string;
    public readonly code: string;
    public readonly parameters: Record<string, any>;

    constructor(init: TransitionBlocker) {
        this.message = init.message;
        this.code = init.code;
        this.parameters = init.parameters;
    }

    public static createBlockedByMarking(marking: Marking) {
        return new TransitionBlocker({
            message: "The marking does not enable the transition.",
            code: TransitionBlockCode.BY_MARKING,
            parameters: {marking},
        });
    }

    public static createBlockedByExpressionGuardListener(expression: string) {
        return new TransitionBlocker({
            message: "The expression blocks the transition.",
            code: TransitionBlockCode.BY_EXPRESSION_GUARD_LISTENER,
            parameters: {expression},
        });
    }

    public static createUnknown() {
        return new TransitionBlocker({
            message: "Unknown reason.",
            code: TransitionBlockCode.UNKNOWN,
            parameters: {},
        });
    }
}
