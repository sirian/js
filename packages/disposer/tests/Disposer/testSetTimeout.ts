import {DisposerManager} from "../../src";

test("Disposer.setTimeout", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);
    jest.useFakeTimers();
    const obj = {};

    expect(dm.isDisposed(obj)).toBe(false);

    dm.for(obj).setTimeout(2);

    jest.advanceTimersByTime(1);
    expect(dm.isDisposed(obj)).toBe(false);

    jest.advanceTimersByTime(1);
    expect(dm.isDisposed(obj)).toBe(true);
});
