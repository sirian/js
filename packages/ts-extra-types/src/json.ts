export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

// export type JsonMLTag = string;
// export type JsonMlAttr = Record<string, unknown>;
// export type JsonMLElement<T extends JsonMLTag = any, A extends JsonMlAttr = JsonMlAttr> =
//     | string
//     | [T, ...Array<JsonMLElement<T, A>>]
//     | [T, A, ...Array<JsonMLElement<T, A>>];
