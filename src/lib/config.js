const DEFAULT_CONFIG = {
    verbose: true
};

let store = Object.assign({}, DEFAULT_CONFIG);

export function get(key) {
    return key ? store[key] : store;
}

export function set(key, value) {
    let changes = {};
    if (typeof key === 'string') {
        changes[key] = value;
    } else if (Object.prototype.toString.call(key) === '[object Object]') {
        changes = key;
    }
    Object.assign(store, changes);
}

let config = set;
config.set = set;
config.get = get;

export default config;
