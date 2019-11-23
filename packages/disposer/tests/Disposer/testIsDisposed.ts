import {Disposer} from "../../src";

test("", () => {
    const foo = {};
    const d = Disposer.for(foo);
    expect(d.isDisposed()).toBe(false);
    d.dispose();
    expect(d.isDisposed()).toBe(true);
});
