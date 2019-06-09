import {Disposer} from "../../src";

test("", () => {
    const foo = {};
    const dfoo = Disposer.for(foo);
    expect(dfoo.isDisposed()).toBe(false);
    dfoo.dispose();
    expect(dfoo.isDisposed()).toBe(true);
});
