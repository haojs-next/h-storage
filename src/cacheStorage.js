
let objs = {};

class CacheStorage {
  "_is_cache" = true
  constructor() {
    Object.defineProperty(this, 'length', {
        get() {
          return Object.keys(objs).length;
        },
    });

    Object.defineProperty(this, 'data', {
        get() {
          return Object.assign({}, objs);
        },
    });
  }
  getItem(name) {
    return objs[name];
  }

  setItem(name, value) {
    if (!name) {
        throw new Error("Key values cannot be null");
    }
    objs[name] = value;
    return true;
  }

  removeItem(name) {
    if (objs[name]) {
      delete objs[name];
      return true
    }
    return false;
  }

  clear() {
    objs = {};
    return true;
  }

  key(index) {
    const keys = Object.keys(objs);
    return typeof keys[index] !== 'undefined' ? keys[index] : null;
  }
}

const cache = new CacheStorage();


export default cache
