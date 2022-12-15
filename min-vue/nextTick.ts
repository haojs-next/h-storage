
const resolvedPromise = Promise.resolve() as Promise<any>;
let currentFlushPromise: Promise<void> | null = null;

export function nextTick<T = void>(
    this: T,
    fn?: (this: T) => void
): Promise<void> {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
}

