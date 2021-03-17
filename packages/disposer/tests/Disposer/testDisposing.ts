import {DisposerManager} from "../../src";

describe("Disposer.isDisposing", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    test("Disposer.isDisposing", () => {
        dm.on("dispose", (t, d) => {
            expect(d.isDisposing()).toBe(true);
            expect(d.isDisposed()).toBe(true);
            expect(d.isDisposedFully()).toBe(false);
        });

        dm.on("disposed", (t, d) => {
            expect(d.isDisposing()).toBe(false);
            expect(d.isDisposed()).toBe(true);
            expect(d.isDisposedFully()).toBe(true);
        });

        const o = {};
        const disposer = dm.for(o);

        expect(disposer.isDisposing()).toBe(false);
        expect(disposer.isDisposed()).toBe(false);
        expect(disposer.isDisposedFully()).toBe(false);

        disposer.onDispose(() => {
            expect(disposer.isDisposing()).toBe(true);
            expect(disposer.isDisposed()).toBe(true);
            expect(disposer.isDisposedFully()).toBe(false);
        });

        disposer.onDisposed(() => {
            expect(disposer.isDisposing()).toBe(false);
            expect(disposer.isDisposed()).toBe(true);
            expect(disposer.isDisposedFully()).toBe(true);
        });
    });
});
