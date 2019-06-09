import {Disposer} from "../../src";

test("Disposer.once", () => {
    let x = 0;
    const fn = () => x++;
    const wrapped = Disposer.once(fn);

    expect(Disposer.isDisposed(wrapped)).toBe(false);
    expect(Disposer.isDisposed(fn)).toBe(false);

    expect(fn()).toBe(0);
    expect(Disposer.isDisposed(wrapped)).toBe(false);
    expect(Disposer.isDisposed(fn)).toBe(false);

    expect(wrapped()).toBe(1);
    expect(Disposer.isDisposed(wrapped)).toBe(true);
    expect(Disposer.isDisposed(fn)).toBe(false);

    expect(() => wrapped()).toThrow(`Object disposed`);

    expect(fn()).toBe(2);
});
