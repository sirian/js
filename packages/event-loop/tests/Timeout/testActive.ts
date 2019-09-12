import {Timeout} from "../../src";

describe("Timeout.active", () => {
    test("", async () => {
        const t = Timeout.create(1, () => {
            expect(t.isActive()).toBe(false);
        });

        expect(t.isActive()).toBe(false);

        t.start();

        expect(t.isActive()).toBe(true);

        await new Promise((r) => setTimeout(r, 1));

        expect(t.isActive()).toBe(false);
    });
});
