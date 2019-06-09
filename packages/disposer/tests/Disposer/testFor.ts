import {Disposer} from "../../src";

test("", () => {
    const foo = {};
    const dfoo = Disposer.for(foo);
    expect(Disposer.for(foo)).toBe(dfoo);
    dfoo.dispose();
    expect(Disposer.for(foo)).toBe(dfoo);
});
