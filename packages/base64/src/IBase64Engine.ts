export interface IBase64Engine {
    encode(value: string): string;
    decode(value: string): string;
    encodeBytes(value: Uint8Array): string;
    decodeToBytes(value: string): Uint8Array;
}
