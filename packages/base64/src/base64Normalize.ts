export const base64Normalize = (value: string) => value
    .replaceAll(" ", "+")
    .replaceAll("-", "+")
    .replaceAll("_", "/");
