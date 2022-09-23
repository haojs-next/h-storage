function sleep (time: number) {
    let start = Date.now();
    let end = start + time;
    while (true) {
        start = Date.now();
        if (start > end) {
            break;
        }
    }
}

export default sleep;


// export function sleepPromise (time: number) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, time)
//     })
// }
