export function set(obj: any, path: string, value: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (path.trim() === '') {
        return obj;
    }

    const keys = path.split('.');

    const emptyKeyIndex = keys.findIndex(key => key === '');
    if (emptyKeyIndex !== -1) {
        throw new Error(`failed to update nested property, empty key at index ${emptyKeyIndex}`);
    }

    const result = Array.isArray(obj) ? [...obj] : { ...obj };
    let current = result;
    let parent: any = undefined;
    let lastKey: string | undefined = undefined;

    for (let i = 0; i < keys.length; i++) {
        const segment = keys[i];

        if (segment === undefined) {
            throw new Error(`undefined segment at index ${i}`);
        }

        if (i === keys.length - 1) {
            if (Array.isArray(current) && isNaN(Number(segment))) {
                throw new Error(`cannot use non-numeric index on array`);
            }
            if (parent && lastKey !== undefined) {
                parent[lastKey] = Array.isArray(current) ? [...current] : { ...current };
                current = parent[lastKey];
            }
            current[segment] = value;
        } else {
            if (!(segment in current)) {
                current[segment] = keys[i + 1] !== undefined && !isNaN(Number(keys[i + 1])) ? [] : {};
            } else if (typeof current[segment] !== 'object') {
                current[segment] = {};
            } else {
                current[segment] = Array.isArray(current[segment]) ? [...current[segment]] : { ...current[segment] };
            }
            parent = current;
            lastKey = segment;
            current = current[segment];
        }
    }

    return result;
}
