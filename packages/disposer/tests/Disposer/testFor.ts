import {Disposer} from "../../src";

test("", () => {
    const foo = {};
    const d = Disposer.for(foo);
    expect(Disposer.for(foo)).toBe(d);
    d.dispose();
    expect(Disposer.for(foo)).toBe(d);
});
