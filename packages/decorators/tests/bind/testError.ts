import {bind} from "../../src";

test("", () => {
    expect(() => {
        class Bar {
            @bind
            protected get x() {
                return 1;
            }
        }
        return Bar;
    }).toThrow("Only put a @bind decorator on a method");
});
