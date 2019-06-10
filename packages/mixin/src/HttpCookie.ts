import {Var} from "@sirian/common";

export class HttpCookie {
    public static decode(s: string) {
        return Var.stringify(s)
            .replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }

    public static encodeValue(value: string) {
        return encodeURIComponent(Var.stringify(value))
            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
    }

    public static encodeKey(key: string) {
        return encodeURIComponent(Var.stringify(key))
            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
            .replace(/[\(\)]/g, escape);
    }
}
