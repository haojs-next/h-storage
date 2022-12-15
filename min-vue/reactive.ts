

/**
 *   reactive 实现原理
 */

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
 
 
 
 
 /**
  *  ts 枚举
  * 
  *  const enum 和 enum 的区别
  */
 const enum Types {
     IS_ARRAY = "Array",
     IS_OBJECT = "Object",
 
 }
 
 console.log(Types.IS_ARRAY);
 
 enum ReactiveFlags {
     SKIP = "__is_skip",
     IS_REACTIVE = "__v_isReactive",
     IS_READONLY = "___v_isReadonly",
     IS_SHALLOW = '__v_isShallow',
     RAW = '__v_raw'
 }
 
 console.log(ReactiveFlags.SKIP);
 