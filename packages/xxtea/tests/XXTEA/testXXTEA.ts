import {Base64, base64Encode} from "@sirian/base64";
import {ByteArray} from "@sirian/common";
import {TestUtil} from "../../../common/tests/TestUtil";
import {XXTEA} from "../../src";

describe("XXTEA", () => {
    const data: string[] = [
        null,
        "",
        "foo",
        "foo bar baz",
        ...TestUtil.randStrings(30),
    ];

    function check(value: string, key: any) {
        const xxtea = new XXTEA(key);
        const encrypted = xxtea.encrypt(value);
        const decrypted = xxtea.decrypt(encrypted);
        expect(decrypted).toStrictEqual(ByteArray.from(value));
    }

    test.each(data)("xxtea.decrypt(xxtea.encrypt(%o)) should be same string", (value: string) => {
        check(value, "");
        check(value, TestUtil.randString(0, 10));
    });

    test("xxtea encrypt/decrypt for unicode data", () => {
        const dataBase64 = "SGVsbG8gV29ybGQhIOS9oOWlve+8jOS4reWbvfCfh6jwn4ez77yB";
        const expectedBase64 = "D4t0rVXUDl3bnWdERhqJmFIanfn/6zAxAY9jD6n9MSMQNoD8TOS4rHHcGuE=";
        const key = "1234567890";

        const xxtea = new XXTEA(key);

        const expected = Base64.decode(dataBase64);
        const encrypted = xxtea.encrypt(expected);
        const decrypted = xxtea.decrypt(encrypted);
        expect(decrypted).toStrictEqual(expected);

        expect(base64Encode(encrypted)).toBe(expectedBase64);
        expect(base64Encode(decrypted)).toBe(dataBase64);
    });
});
