/*!
 * hx-storage v1.0.2
 * (c) 2018-2021 ljh
 * Released under the MIT License.
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var objs = {};

var CacheStorage = /*#__PURE__*/function () {
  function CacheStorage() {
    _classCallCheck(this, CacheStorage);

    _defineProperty(this, "_is_cache", true);

    Object.defineProperty(this, 'length', {
      get: function get() {
        return Object.keys(objs).length;
      }
    });
    Object.defineProperty(this, 'data', {
      get: function get() {
        return Object.assign({}, objs);
      }
    });
  }

  _createClass(CacheStorage, [{
    key: "getItem",
    value: function getItem(name) {
      return objs[name];
    }
  }, {
    key: "setItem",
    value: function setItem(name, value) {
      if (!name) {
        throw new Error("Key values cannot be null");
      }

      objs[name] = value;
      return true;
    }
  }, {
    key: "removeItem",
    value: function removeItem(name) {
      if (objs[name]) {
        delete objs[name];
        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      objs = {};
      return true;
    }
  }, {
    key: "key",
    value: function key(index) {
      var keys = Object.keys(objs);
      return typeof keys[index] !== 'undefined' ? keys[index] : null;
    }
  }]);

  return CacheStorage;
}();

var cache = new CacheStorage();

var _global = typeof window !== 'undefined' ? window : global || {};

var SPLIT_STR = "$@";
var DATA_PROCESS_MAPPING = {
  number: {
    save: function save(data) {
      return data;
    },
    parse: function parse(data) {
      return Number.parseFloat(data);
    }
  },
  object: {
    save: function save(data) {
      return JSON.stringify(data);
    },
    parse: function parse(data) {
      return JSON.parse(data);
    }
  },
  undefined: {
    save: function save(data) {
      return data;
    },
    parse: function parse() {
      return undefined;
    }
  },
  "default": {
    save: function save(data) {
      return data;
    },
    parse: function parse(data) {
      return data;
    }
  }
};

function getProcess(type) {
  return DATA_PROCESS_MAPPING[type] || DATA_PROCESS_MAPPING["default"];
}

var stObj = {
  "local": _global.localStorage,
  "session": _global.sessionStorage,
  "cache": cache
};

function getStorage(name) {
  var _stObj$name;

  return (_stObj$name = stObj[name]) !== null && _stObj$name !== void 0 ? _stObj$name : cache;
}

var Storage = /*#__PURE__*/function () {
  function Storage(name) {
    _classCallCheck(this, Storage);

    Storage.storage = getStorage(name);
  }

  _createClass(Storage, [{
    key: "get",
    value: function get(key) {
      var st = Storage.storage;
      var stringData = st.getItem(Storage.options.namespace + key);

      if (stringData) {
        var dataArray = stringData.split(SPLIT_STR);
        var data;
        var now = Date.now();

        if (dataArray.length > 2 && dataArray[2] < now) {
          // 缓存过期
          this.remove(key);
          return null;
        } else {
          var value = decodeURIComponent(dataArray[1]);
          data = getProcess(dataArray[0]).parse(value);
          return data;
        }
      }

      return null;
    }
  }, {
    key: "set",
    value: function set(key, value, options) {
      options = Object.assign({
        expires: 0,
        // expires 设置有效时间 单位天
        encode: true // 是否编码加密

      }, options);

      if (options.expires && typeof options.expires !== "number") {
        throw new Error("The Expires setting must be a number");
      }

      var type = _typeof(value);

      var process = getProcess(type);
      var NEW_VALUE = options.encode ? encodeURIComponent(process.save(value)) : process.save(value);

      if (options.expires <= 0) {
        // 默认不传 不过期
        value = type + SPLIT_STR + NEW_VALUE;
      } else {
        var time = options.expires * 24 * 60 * 60 * 1000 + new Date().getTime();
        value = type + SPLIT_STR + NEW_VALUE + SPLIT_STR + time;
      }

      Storage.storage.setItem(Storage.options.namespace + key, value);
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      Storage.storage.clear();
      return true;
    }
  }, {
    key: "remove",
    value: function remove(key) {
      Storage.storage.removeItem(Storage.options.namespace + key);
      return true;
    }
  }, {
    key: "setOptions",
    value: function setOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.storage && ['local', 'session', "cache"].indexOf(options.storage) === -1) {
        throw new Error("hx-storage: storage " + options.storage + " is not supported");
      }

      Storage.options = Object.assign(Storage.options, options);
      var lsName = Storage.options.storage || "local";
      Storage.storage = getStorage(lsName);
      return true;
    }
  }, {
    key: "list",
    value: function list() {
      var data = Storage.storage;
      var datas = data !== null && data !== void 0 && data._is_cache ? _objectSpread2({}, data.data) : _objectSpread2({}, data);
      return datas;
    }
  }]);

  return Storage;
}();

_defineProperty(Storage, "storage", null);

_defineProperty(Storage, "options", {
  namespace: '',
  // key 键前缀
  storage: 'local' // 存储名称: session, local

});

var hxStorage = new Storage("local");

export { hxStorage as default };

/** Tue Oct 26 2021 21:46:59 GMT+0800 (GMT+08:00) **/
