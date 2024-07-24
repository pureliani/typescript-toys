export function equals(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!equals(a[i], b[i])) return false;
        }
        return true;
    }

    if (
        Object.prototype.toString.call(a) === "[object Object]" &&
        Object.prototype.toString.call(b) === "[object Object]"
    ) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!equals(a[key], b[key])) return false;
        }

        return true;
    }

    return false;
}
