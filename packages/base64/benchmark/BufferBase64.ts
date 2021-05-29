const Buffer = (globalThis as any).Buffer;

export interface IBase64 {
    encode: (value: string) => string;
    decode: (value: string) => string;
}

export const BufferBase64: IBase64 = {
    encode: (x: string) => Buffer.from(x).toString("base64"),
    decode: (x: string) => Buffer.from(x, "base64").toString(),
};
