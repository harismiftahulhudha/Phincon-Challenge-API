let cache = {}
const getFibonacciByIndex = n => {
    if (n <= 1) {
        return n
    }

    if(cache[n]) {
        return cache[n]
    }

    const result = getFibonacciByIndex(n - 1) + getFibonacciByIndex(n - 2)

    cache[n] = result

    return result
}

module.exports = (n) => {
    return getFibonacciByIndex(n)
}