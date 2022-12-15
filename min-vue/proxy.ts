
let data = {
    name: "哈哈",
}


Object.defineProperty(data, "$modal", {
    get: function () {
        return "yes"
    }
})


console.log(data);


const data2 = {
    $modal: "测试"
}

const targetData = Object.defineProperties(data2, {
    $modal: {
        value: "哈哈",
        writable: false,
        configurable: false
    }
})
let obj = new Proxy(targetData, {
    get: function (target, key, receiver) {
        return Reflect.get(target, key, receiver)
    }
})

obj.$modal = "修改"; // 无法修改

console.log(obj, obj.$modal); // obj.$modal 显示 "哈哈"，无法修改
