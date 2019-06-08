export declare type JSONPrimitive = string | number | boolean | null;
export declare type JSONObject = {
    [P in string | number]: JSONValue;
};
export interface JSONArray extends Array<JSONArray | JSONValue | JSONObject> {
}
export declare type JSONValue = JSONPrimitive | JSONObject | JSONArray;
//# sourceMappingURL=json.d.ts.map