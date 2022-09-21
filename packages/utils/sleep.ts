function sleep (delay: number) {
    let start = Date.now();
    while (Date.now() - start > delay) {
        break
    }
}

export default sleep;


export function sleepPromise (time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}
