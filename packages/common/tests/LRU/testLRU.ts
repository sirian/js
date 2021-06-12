import {LRU, randomInt} from "../../src";

test("LRU", function() {
    const maxSize = 3;

    const lru = new LRU(maxSize);

    const getModifiedKeyOrder = (key: any) => lru.keys().filter((k) => k !== key).concat([key]).slice(-maxSize);

    for (let i = 0; i < 100; i++) {
        const key = randomInt(1, 10);
        const keys = getModifiedKeyOrder(key);

        lru.set(key, "");

        expect([...lru.keys()]).toStrictEqual(keys);
        expect(lru.size).toBe(keys.length);

        for (let j = 0; j < 10; j++) {
            const k = randomInt(1, 10);

            const expectedKeys = lru.has(k) ? getModifiedKeyOrder(k) : lru.keys();
            lru.get(k);
            expect([...lru.keys()]).toStrictEqual(expectedKeys);
            expect(lru.size).toBe(expectedKeys.length);
        }
    }
});
