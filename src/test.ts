import hxStorage from "./index";

const ls = hxStorage({
    storage: "session"
})


ls.set('b', "浩浩")
ls.set('my', { name: '君君'}, { expires: 1 })

const a = ls.get('my')
console.log(ls.get('b'), a)
