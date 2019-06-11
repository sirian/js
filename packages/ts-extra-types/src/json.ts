export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = { [P in string | number]: JSONValue };

export interface JSONArray extends Array<JSONArray | JSONValue | JSONObject> {
}

export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
