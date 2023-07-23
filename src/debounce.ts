export {}


function debounce<F extends (...args: any[]) => void>(fn: F, delay_ms: number): F {
    let timeout = 0
    return ((...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), delay_ms)
    }) as F
}

const hello = debounce(() => console.log("Hello"), 0)

for(let i = 0; i < 500_000; i ++) {
    hello() // no console logs for 500K loops
}
hello() // "Hello" after 500K loops