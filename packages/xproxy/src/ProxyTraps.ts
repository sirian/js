export type ProxyTrap = keyof ProxyHandler<any>;

export const ProxyTraps = [
    "getOwnPropertyDescriptor",
    "has",
    "get",
    "set",
    "deleteProperty",
    "defineProperty",
    "isExtensible",
    "preventExtensions",
    "getPrototypeOf",
    "setPrototypeOf",
    "ownKeys",
    "apply",
    "construct",
] as const;
