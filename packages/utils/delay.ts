function delay(func: Function, wait: number, ...args: any[]) {
    if (typeof func !== "function") {
        throw new TypeError("Expected a function");
    }
    return setTimeout(func, +wait || 0, ...args);
}

export default delay;
