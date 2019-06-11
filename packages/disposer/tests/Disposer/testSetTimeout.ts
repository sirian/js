import {Disposer} from "../../src";

test("Disposer.setTimeout", async () => {
    jest.useFakeTimers();
    const obj = {};

    expect(Disposer.isDisposed(obj)).toBe(false);

    Disposer.setTimeout(2, obj);

    jest.runTimersToTime(1);
    expect(Disposer.isDisposed(obj)).toBe(false);

    jest.runTimersToTime(2);
    expect(Disposer.isDisposed(obj)).toBe(true);
});
