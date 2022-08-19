/**
 * javascript 本地存储
 * 使用 localStorage 来进行缓存数据
 **/

const _global = (typeof window !== 'undefined' ? window : global || {});

type METHODS = {
    save(data: any): any;
    parse(data: any): any
}

interface DATAPROCESSMAPPING {
    number: METHODS;
    object: METHODS;
    undefined: METHODS;
    default: METHODS;
}

const SPLIT_STR = "$@";
const DATA_PROCESS_MAPPING: DATAPROCESSMAPPING = {
    number: {
        save: (data) => data,
        parse: (data) => Number.parseFloat(data)
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

type Options = {
    expires?: number;
    encode?: boolean;
}

function getProcess(type: string) {
    return DATA_PROCESS_MAPPING[type] || DATA_PROCESS_MAPPING["default"];
}


const stObj = {
    "local": _global.localStorage,
    "session": _global.sessionStorage,
}

function getStorage (name: string = 'local') {
    return  stObj[name] || stObj['local']
}

type StorageName = 'session' | 'local'

interface StOptions {
    namespace?: string;
    storage?: StorageName
}

class Storage {
    storage
    options: StOptions = {
        namespace: 'HX_',      // key 键前缀
        storage: 'local',   // 存储名称: session, local
    }
    constructor (options?: StOptions) {
        Object.assign(this.options, options);
        let lsName = this.options.storage;
        this.storage = getStorage(lsName);
        
        Object.defineProperty(this, "length", {
            get() {
                return this.storage.length
            },
        })
    }
    get(key: string) {
        let stringData = this.storage.getItem(this.options.namespace  + key);
        if (stringData) {
            let dataArray: Array<any> = stringData.split(SPLIT_STR);
            let data;
            let now = Date.now();
            if (dataArray.length > 2 && dataArray[2] < now) {
                // 缓存过期
                this.remove(key);
                return null;
            }
            let value = dataArray.length > 3 && dataArray[3] === 'isEncodeURIComponent' ? decodeURIComponent(dataArray[1]) : dataArray[1];
            data = getProcess(dataArray[0]).parse(value);
            return data;
        }
        return null;
    }
    set(key: string, value: any, options: Options = {}) {
        options = Object.assign(
            {
                expires: 0,  // expires 设置有效时间 单位天
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
        if (options.expires! <= 0) {
            // 默认不传 不过期
            value = type + SPLIT_STR + NEW_VALUE;
        } else {
            let time = options.expires! * 24 * 60 * 60 * 1000 + new Date().getTime();
            value = type + SPLIT_STR + NEW_VALUE + SPLIT_STR + time;
        }
        options.encode && (value = value + SPLIT_STR + "isEncodeURIComponent");
        this.storage.setItem(this.options.namespace + key, value);
        return true
    }
    clear() {
        return this.storage.clear();
    }
    remove(key: string) {
        return this.storage.removeItem(this.options.namespace + key);
    }
    key(index: number) {
        return this.storage.key(index);
    }
}

function hxStorage (options?: StOptions) {
   return new Storage(options);
}

export default hxStorage;
