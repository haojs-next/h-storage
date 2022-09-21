import hxStorage from "./index";

const ls = hxStorage({
    storage: "session"
})


ls.set('b', "浩浩")
ls.set('my', { name: '君君'}, { expires: 1 })

const a = ls.get('my')
console.log(ls.get('b'), a)

type Function = () => void

const App = document.getElementById('app') as HTMLElement;

// const bucket = new Set();

// const state = new Proxy({
//     name: "hello wrold!"
// }, {
//     get (target, key) {
//         const value = target[key]
//         bucket.add(effect)
//         console.log(`get ${ String(key) }: ${ value }`)
//         return value;
//     },
//     set (target, key, newValue) {
//         console.log(target, key, newValue)
//         target[key] = newValue;
//         bucket.forEach((fn: any) => fn())
//         return true
//     }
// })

// const effect = () => {
//     App.innerHTML = state.name
// }


// effect();

// setTimeout(() => {
//     state.name = "hello Vue"
// }, 1000)


const bucket = new WeakMap();

let activeEffect:Function;
function effect<T = any>(fn: () => T) {
    activeEffect = fn
    fn()
}

// track 追踪意思
function track (target: object, key: any) {
    if (!activeEffect) {
        return
    }

    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }

    let deps = depsMap.get(key)

    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }

    deps.add(activeEffect);
}   

//
function trigger (target: object, key: any) {
    const depsMap = bucket.get(target)
    if (!depsMap) {
        return
    }
    const effect = depsMap.get(key)

    effect && effect.forEach((fn: Function) => fn())
}

function reactive<T extends object> (state: T) {
    return new Proxy(state, {
        get (target, key) {
            const value = target[ key ]
            track(target, key)
            return value;
        },
        set (target, key, newValue) {
            target[ key ] = newValue;
            trigger(target, key)
            return true;
        }
    })
}


const state = reactive<{ name: string }>({
    name: "hello"
})

effect(() => {
    App.innerText = state.name
})


setTimeout(() => {
    state.name = "Vue"
}, 1000)