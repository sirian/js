import {Disposer} from "../../src";

describe("Disposer.isDisposing", () => {
    test("Disposer.isDisposing", () => {
        Disposer.events.on("dispose", (d) => {
            expect(d.isDisposing()).toBe(true);
            expect(d.isDisposed()).toBe(true);
            expect(d.isDisposedFully()).toBe(false);
        });

        Disposer.events.on("disposed", (d) => {
            expect(d.isDisposing()).toBe(false);
            expect(d.isDisposed()).toBe(true);
            expect(d.isDisposedFully()).toBe(true);
        });

        const o = {};
        const disposer = Disposer.for(o);

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
