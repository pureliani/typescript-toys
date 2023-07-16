export {}

type Key = string | symbol | number
type Objectish = { [key: Key]: any }

type Operation = {
    type: 'get'
    prop: Key
} | {
    type: 'set'
    prop: Key
    value: unknown
}

const shallow_copy = <T>(state: T): T => {
    if (typeof state !== 'object' || state === null) return state;
    const proto = Object.getPrototypeOf(state);

    if (Array.isArray(state)) return state.slice() as T;
    else if (state instanceof Date) return new Date(state.getTime()) as T;
    else if (state instanceof Set) return new Set(state) as T;
    else if (state instanceof Map) return new Map(state) as T;
    else return Object.assign(Object.create(proto), state);
};

const record = <T extends Objectish>() => {
    const operation_chains: Operation[][] = []

    const root_handler: ProxyHandler<any> = {
        get(_, p) {
            operation_chains.push([{ type: 'get', prop: p }])
            return new Proxy({}, non_root_handler)
        },
        set(_, p, v) {
            operation_chains.push([{ type: 'set', prop: p, value: v }])
            return true
        }
    }

    const non_root_handler: ProxyHandler<any> = {
        get(_, p) {
            operation_chains[operation_chains.length - 1].push({ type: 'get', prop: p })
            return new Proxy({}, non_root_handler)
        },
        set(_, p, v) {
            operation_chains[operation_chains.length - 1].push({ type: 'set', prop: p, value: v })
            return true
        }
    }

    const recorder = new Proxy({}, root_handler) as T
    return { recorder, operation_chains }
}

const apply = <T extends Objectish>(target: T, operation_chains: Operation[][]): T => {
    const new_target = shallow_copy(target);

    for (const operation_chain of operation_chains) {
        let current: any = new_target;

        for (const operation of operation_chain) {
            if (operation.type === 'get') {
                if (!current.hasOwnProperty(operation.prop)) {
                    throw new Error(`Property '${String(operation.prop)}' does not exist on the target object`);
                }

                current[operation.prop] = shallow_copy(current[operation.prop]);
                current = current[operation.prop];
            } else if (operation.type === 'set') {
                current[operation.prop] = operation.value;
            }
        };
    };

    return new_target;
};

const example_state = {
    a: {
        b: [{
            c: 0
        }]
    },
    d: {
        e: {
            f: 1
        }
    }
}

const { recorder, operation_chains } = record<typeof example_state>()
recorder.a.b[0].c = 1
recorder.a.b[0].c = 2

const result = apply(example_state, operation_chains)

console.log(JSON.stringify(result, null, 2)) // { a: { b: [{ c: 2 }] }, d: { e: { f: 1 } } }
console.log(result.d === example_state.d) // true