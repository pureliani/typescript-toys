export {}

function throttle_by_time<const R, F extends (...args: any[]) => R>(fn: F, count: number): F {
    let counter = 0
    let lastResult: R | undefined
    return ((...args) => {
        if(lastResult && counter <= count)  {
            counter++
            console.log("cache")
            return lastResult
        }
        counter++
        console.log("no cache")
        lastResult = fn(...args)
        return lastResult
    }) as F
}

let hello = throttle_by_time(() => "Hello world", 3)
hello() // no cache
hello() // cache
hello() // cache
hello() // cache
hello() // no cache
