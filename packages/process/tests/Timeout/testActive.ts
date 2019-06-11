import {Timeout} from "../../src";

describe("Timeout.active", () => {
    test("", async () => {
        const t = Timeout.create(1, () => {
            expect(t.isActive()).toBe(false);
            expect(Timeout.active.size).toBe(0);
        });

        expect(t.isActive()).toBe(false);
        expect(Timeout.active.size).toBe(0);

        t.start();

        expect(t.isActive()).toBe(true);
        expect(Timeout.active.size).toBe(1);

        await new Promise((r) => setTimeout(r, 1));

        expect(t.isActive()).toBe(false);
        expect(Timeout.active.size).toBe(0);
    });
});
