import {XProxy} from "../../src";

describe("XProxy.get/set", () => {
    test("XProxy.get/set", () => {
        const obj = {x: 1};
        const proxy = XProxy.forObject({target: obj});

        expect(obj.x).toBe(1);
        expect(proxy.x).toBe(1);

        obj.x = 2;
        expect(obj.x).toBe(2);
        expect(proxy.x).toBe(2);

        proxy.x = 3;
        expect(obj.x).toBe(3);
        expect(proxy.x).toBe(3);

        XProxy.get(proxy).setTarget({x: 0});

        expect(obj.x).toBe(3);
        expect(proxy.x).toBe(0);

        obj.x = 5;
        expect(obj.x).toBe(5);
        expect(proxy.x).toBe(0);

        proxy.x = 6;
        expect(obj.x).toBe(5);
        expect(proxy.x).toBe(6);
    });

    test.skip("XProxy for native objects should not throw errors about incompatible receiver", () => {
        const x = XProxy.forObject(() => new Uint8Array([1, 2, 3]));
        expect(x.length).toBe(3);
        expect(x[0]).toBe(1);
        expect(x).toBeInstanceOf(Uint8Array);
        expect(x.slice()).toBeInstanceOf(Uint8Array);
    });
});
