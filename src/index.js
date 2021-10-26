/**
 * javascript 本地存储
 * 使用 localStorage 来进行缓存数据
 **/
import cache from "./cacheStorage";

const _global = (typeof window !== 'undefined' ? window : global || {});

const SPLIT_STR = "$@";
const DATA_PROCESS_MAPPING = {
    number: {
        save: data => data,
        parse: data => Number.parseFloat(data)
    },
    object: {
        save: data => JSON.stringify(data),
        parse: data => JSON.parse(data)
    },
    undefined: {
        save: data => data,
        parse: () => undefined
    },
    default: {
        save: data => data,
        parse: data => data
    }
};

function getProcess(type) {
    return DATA_PROCESS_MAPPING[type] || DATA_PROCESS_MAPPING["default"];
}


const stObj = {
    "local": _global.localStorage,
    "session": _global.sessionStorage,
    "cache": cache
}

function getStorage (name) {
    return  stObj[name] ?? cache
}

class Storage {
    static storage = null;
    static options = {
        namespace: '',      // key 键前缀
        storage: 'local',   // 存储名称: session, local
    }
    constructor (name) {
        Storage.storage = getStorage(name);
    }
    get(key) {
        let st = Storage.storage;
        let stringData = st.getItem(Storage.options.namespace  + key);
        if (stringData) {
            let dataArray = stringData.split(SPLIT_STR);
            let data;
            let now = Date.now();
            if (dataArray.length > 2 && dataArray[2] < now) {
                // 缓存过期
                this.remove(key);
                return null;
            } else {
                let value = decodeURIComponent(dataArray[1]);
                data = getProcess(dataArray[0]).parse(value);
                return data;
            }
        }
        return null;
    }
    set(key, value, options) {
        options = Object.assign(
            {
                expires: 0, // expires 设置有效时间 单位天
                encode: true // 是否编码加密
            },
            options
        );

        if (options.expires && typeof options.expires !== "number") {
            throw new Error("The Expires setting must be a number");
        }
        const type = typeof value;
        const process = getProcess(type);
        let NEW_VALUE = options.encode ? encodeURIComponent(process.save(value)) : process.save(value);
        if (options.expires <= 0) {
            // 默认不传 不过期
            value = type + SPLIT_STR + NEW_VALUE;
        } else {
            let time = options.expires * 24 * 60 * 60 * 1000 + new Date().getTime();
            value = type + SPLIT_STR + NEW_VALUE + SPLIT_STR + time;
        }
        Storage.storage.setItem(Storage.options.namespace + key, value);
        return true
    }
    clear() {
        Storage.storage.clear();
        return true
    }
    remove(key) {
        Storage.storage.removeItem(Storage.options.namespace + key);
        return true
    }
    setOptions (options = {}) {
        if (options.storage && ['local', 'session', "cache"].indexOf(options.storage) === -1) {
            throw new Error("hx-storage: storage "+ options.storage +" is not supported");
        }
        Storage.options = Object.assign(Storage.options, options);
        let lsName = Storage.options.storage || "local";
        Storage.storage = getStorage(lsName);
        return true
    }
    list () {
        let data = Storage.storage;
        let datas = data?._is_cache ? { ...data.data } : { ...data }
        return datas;
    }
}

let hxStorage = new Storage("local");

export default hxStorage;
