export {}

function throttle_by_time<const R, F extends (...args: any[]) => R>(fn: F, delay_ms: number): F {
    let lastCall = -1
    let lastResult: R | undefined
    return ((...args) => {
        if(lastResult && Date.now() - lastCall < delay_ms)  {
            console.log("cache")
            return lastResult
        }
        console.log("no cache")
        lastCall = Date.now()
        lastResult = fn(...args)
        return lastResult
    }) as F
}

let hello = throttle_by_time(() => "Hello world", 500)
setTimeout(hello, 50) // no cache
setTimeout(hello, 100) // cache
setTimeout(hello, 200) // cache
setTimeout(hello, 300) // cache
setTimeout(hello, 400) // cache
setTimeout(hello, 600) // no cache