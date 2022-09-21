/**
 * javascript 本地存储
 * 使用 localStorage 来进行缓存数据
 **/
import { encrypt, decrypt } from "./cryptojs2";


type METHODS<T = any, U = any> = {
    save(data: T): T;
    parse(data: U): U;
}

interface DATAPROCESSMAPPING {
    number: METHODS<number>;
    object: METHODS;
    undefined: METHODS<undefined, undefined>;
    default: METHODS;
}

const SPLIT_STR = "$@";
const DATA_PROCESS_MAPPING: DATAPROCESSMAPPING = {
    number: {
        save: (data) => data,
        parse: (data) => Number.parseFloat(data)
    },
    object: {
        save: (data) => JSON.stringify(data),
        parse: (data) => JSON.parse(data)
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
    "local": localStorage,
    "session": sessionStorage,
}

function getStorage (name: string = 'local') {
    return  stObj[name] || stObj['local']
}

type StorageName = 'session' | 'local';

const encryptName: string = "onEncrypt";        // 开启加密
const notEncryptName: string = "offEncrypt";    // 取消加密

interface StOptions {
    namespace?: string;
    storage?: StorageName
}

class Storage {
    private storage
    private options: StOptions = {
        namespace: 'HX_',      // key 键前缀
        storage: 'local',   // 存储名称: session, local
    };
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
            if (dataArray.length > 3 && dataArray[3] < now) {                
                // 缓存过期
                this.remove(key);
                return null;
            }
            let value = dataArray.length > 2 && dataArray[2] === encryptName ? decrypt(dataArray[1]) : dataArray[1];
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
        let NEW_VALUE = options.encode ? encrypt(process.save(value)) : process.save(value);
        let ecrypt =  options.encode ? encryptName : notEncryptName;
        if (options.expires! <= 0) {
            // 默认不传 不过期
            value = type + SPLIT_STR + NEW_VALUE + SPLIT_STR + ecrypt;
            
        } else {
            let time = options.expires! * 24 * 60 * 60 * 1000 + new Date().getTime();
            value = type + SPLIT_STR + NEW_VALUE + SPLIT_STR + ecrypt + SPLIT_STR + time;
        }
        
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
