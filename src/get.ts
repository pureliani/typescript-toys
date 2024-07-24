export function get<T = any>(obj: any, path: string): T | undefined {
    if (path === "") return obj;
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return obj;
    let result = obj;

    for (const key of keys) {
        if (Array.isArray(result) && /^\d+$/.test(key)) {
            const index = Number.parseInt(key, 10);
            result = result?.[index];
        } else if (Object.prototype.toString.call(result) === "[object Object]") {
            result = result?.[key];
        } else {
            return undefined;
        }
    }

    return result?.[lastKey];
}
