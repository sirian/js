import {XProxy} from "../../src";

describe("XProxy.revoke", () => {
    test("XProxy.revoke", () => {
        const proxy = XProxy.forObject({target: {x: 1}});
        const xProxy = XProxy.get(proxy)!;

        expect(xProxy.isRevoked()).toBe(false);
        expect(proxy.x).toBe(1);

        xProxy.revoke();

        expect(xProxy.isRevoked()).toBe(true);
        expect(() => proxy.x).toThrow("Cannot perform 'get' on a xProxy that has been revoked");
    });
});
