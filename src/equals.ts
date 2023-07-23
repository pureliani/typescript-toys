export {}

const are_object_keys_equal = <T extends object> (a: T, b: T) => {
    const a_keys = Object.keys(a)
    const b_keys = Object.keys(b)

    const is_a_matching_b = b_keys.every(k => k in a)
    const is_b_matching_a = a_keys.every(k => k in b)

    return is_a_matching_b && is_b_matching_a
}

function equals(a: any, b: any): boolean {
    if(a === b) return true
    if(a !== null && b === null || a === null && b !== null) return false
    if(typeof a === 'object' && typeof b !== 'object' || typeof a !== 'object' && typeof b === 'object') return false
    const are_keys_equal = are_object_keys_equal(a, b)
    if(!are_keys_equal) return false;

    a[Symbol.for('visited')] = true
    b[Symbol.for('visited')] = true

    let isEqual = true
    for(const [k, v] of Object.entries(a)) {
        if((v as any)[Symbol.for('visited')] && (b[k] as any)[Symbol.for("visited")]) {
            isEqual = are_object_keys_equal(v, b[k]);
            continue;
        }
        isEqual = equals(v, b[k]);
        if (!isEqual) break;
    }

    delete a[Symbol.for('visited')];
    delete b[Symbol.for('visited')];

    return isEqual
}

console.log(equals([{ a: 1, b: { x: [5] } }], [{ a: 1, b: { x: [5] } }])) // true
console.log(equals([{ a: 1, b: { x: [5] } }], [{ a: 1, b: { x: [5], z: 2 } }])) // false

const a = {};
//@ts-ignore
a.self = a;

const b = {};
//@ts-ignore
b.self = b;

console.log(equals(a, b));  // true ( structure is the same )
