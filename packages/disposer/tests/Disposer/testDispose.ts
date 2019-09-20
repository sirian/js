import {Disposer} from "../../src";

describe("Disposer.dispose", () => {
    test("Disposer preserves after disposing", () => {
        const o = {};
        const d1 = Disposer.for(o);
        Disposer.dispose(d1);
        expect(Disposer.for(o)).toBe(d1);
    });
});
