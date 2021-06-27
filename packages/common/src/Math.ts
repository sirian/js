export const abs = <T extends number | bigint>(value: T): T =>
    (0 === value ? value * value : value < 0 ? -value : value) as T;
