export const max = <T extends number | bigint>(...values: [T, ...T[]]) =>
    values.reduce((a, b) => a > b ? a : b);

export const min = <T extends number | bigint>(...values: [T, ...T[]]) =>
    values.reduce((a, b) => a < b ? a : b);

export const abs = <T extends number | bigint>(value: T) =>
    value > 0 ? value : -value as T;
