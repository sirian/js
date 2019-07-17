import {Base64} from "@sirian/base64";
import {Unicode} from "@sirian/common";
import {XXTEA} from "../../src/XXTEA";

test("XXTEA", function() {
    const data: string = "Hello World! 你好，中国🇨🇳！";
    const encryptedBase64 = "D4t0rVXUDl3bnWdERhqJmFIanfn/6zAxAY9jD6n9MSMQNoD8TOS4rHHcGuE=";
    const key = "1234567890";
    const encrypted = XXTEA.encrypt(data, key);
    const decrypted = XXTEA.decrypt(encrypted, key);
    expect(Base64.encode(encrypted)).toStrictEqual(encryptedBase64);
    expect(Unicode.bytesToString(decrypted)).toStrictEqual(data);
});
