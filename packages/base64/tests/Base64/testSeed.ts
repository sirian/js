import {Base64} from "../../src";

function seed(length: number) {
    const a = [];

    for (let i = 0; i < length; i++) {
        a.push(Math.floor(0xFFFF * Math.random()));
        a.push(Math.floor(0xFFF * Math.random()));
        a.push(Math.floor(0xFF * Math.random()));
    }

    return a.join("");
}

describe("Random strings", () => {
    for (let i = 0; i < 8; i++) {
        const str = seed(i << i);
        test("Length: " + str.length, () => {
            const encoded = Base64.encode(str);
            const decoded = Base64.decode(encoded);
            expect(decoded).toBe(str);
        });
    }
});
