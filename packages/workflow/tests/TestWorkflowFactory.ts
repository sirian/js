import {Definition, Transition} from "../src";

export class TestWorkflowFactory {
    public static createComplexWorkflowDefinition() {
        return new Definition("abcdefg", [
            new Transition("t1", "a", ["b", "c"]),
            new Transition("t2", ["b", "c"], "d"),
            new Transition("t3", "d", "e"),
            new Transition("t4", "d", "f"),
            new Transition("t5", "e", "g"),
            new Transition("t6", "f", "g"),
        ]);

        // The graph looks like:
        // +---+     +----+     +---+     +----+     +----+     +----+     +----+     +----+     +---+
        // | a | --> | t1 | --> | c | --> | t2 | --> | d  | --> | t4 | --> | f  | --> | t6 | --> | g |
        // +---+     +----+     +---+     +----+     +----+     +----+     +----+     +----+     +---+
        //             |                    ^          |                                           ^
        //             |                    |          |                                           |
        //             v                    |          v                                           |
        //           +----+                 |        +----+     +----+     +----+                  |
        //           | b  | ----------------+        | t3 | --> | e  | --> | t5 | -----------------+
        //           +----+                          +----+     +----+     +----+
    }

    public static createSimpleWorkflowDefinition() {
        return new Definition("abc", [
            new Transition("t1", "a", "b"),
            new Transition("t2", "b", "c"),
        ]);

        // The graph looks like:
        // +---+     +----+     +---+     +----+     +---+
        // | a | --> | t1 | --> | b | --> | t2 | --> | c |
        // +---+     +----+     +---+     +----+     +---+
    }

    public static createWorkflowWithSameNameTransition() {
        return new Definition("abc", [
            new Transition("a_to_bc", "a", ["b", "c"]),
            new Transition("b_to_c", "b", "c"),
            new Transition("to_a", "b", "a"),
            new Transition("to_a", "c", "a"),
        ]);

        // The graph looks like:
        //   +------------------------------------------------------------+
        //   |                                                            |
        //   |                                                            |
        //   |         +----------------------------------------+         |
        //   v         |                                        v         |
        // +---+     +---------+     +---+     +--------+     +---+     +------+
        // | a | --> | a_to_bc | --> | b | --> | b_to_c | --> | c | --> | to_a | -+
        // +---+     +---------+     +---+     +--------+     +---+     +------+  |
        //   ^                         |                                  ^       |
        //   |                         +----------------------------------+       |
        //   |                                                                    |
        //   |                                                                    |
        //   +--------------------------------------------------------------------+
    }

    public static createComplexStateMachineDefinition() {
        return new Definition("abcd", [
            new Transition("t1", "a", "b"),
            new Transition("t1", "d", "b"),
            new Transition("t2", "b", "c"),
            new Transition("t3", "b", "d"),
        ]);

        // The graph looks like:
        //                     t1
        //               +------------------+
        //               v                  |
        // +---+  t1   +-----+  t2   +---+  |
        // | a | ----> |  b  | ----> | c |  |
        // +---+       +-----+       +---+  |
        //               |                  |
        //               | t3               |
        //               v                  |
        //             +-----+              |
        //             |  d  | -------------+
        //             +-----+
    }
}
