import {DisposerManager} from "../../src";

test("Disposer.setTimeout", async () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);
    jest.useFakeTimers();
    const obj = {};

    expect(dm.isDisposed(obj)).toBe(false);

    dm.setTimeout(obj, 2);

    jest.runTimersToTime(1);
    expect(dm.isDisposed(obj)).toBe(false);

    jest.runTimersToTime(2);
    expect(dm.isDisposed(obj)).toBe(true);
});
