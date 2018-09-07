(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Logline = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get$1 = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var DEFAULT_CONFIG = {
    verbose: true
};

var store = _extends({}, DEFAULT_CONFIG);

function get$$1(key) {
    return key ? store[key] : store;
}

function set$$1(key, value) {
    var changes = {};
    if (typeof key === 'string') {
        changes[key] = value;
    } else if (Object.prototype.toString.call(key) === '[object Object]') {
        changes = key;
    }
    _extends(store, changes);
}

var config = set$$1;
config.set = set$$1;
config.get = get$$1;

var HAS_CONSOLE = window.console;
var LEVEL_CONSOLE_MAP = {
    INFO: 'log',
    WARN: 'warn',
    ERROR: 'error',
    CRITICAL: 'error'
};

// throw out Errors, with global prefix 'Logline: ' ahead of err.message
function throwError(errMessage) {
    HAS_CONSOLE && console.error('Logline: ' + errMessage);
}

// print debug info in develper's console
// TODO: if WechatFE/vConsole is detected, will not use %c feature, as it is not well supported
function debug(namespace, level, descriptor, data) {
    if (HAS_CONSOLE && config.get().verbose) {
        window.console[LEVEL_CONSOLE_MAP[level.toUpperCase()] || LEVEL_CONSOLE_MAP.INFO](namespace + ' ' + level.toUpperCase() + ' ' + descriptor, data || '');
    }
}

// filter any function in a object
function filterFunction(obj) {
    var newObj = {},
        i;

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return obj;
    }

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (typeof obj[i] !== 'function') {
                newObj[i] = filterFunction(obj[i]);
            }
        }
    }
    return newObj;
}

/**
 * Logline Interface
 * @class Interface
 */

var Interface = function () {
    /**
     * Logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function Interface(namespace) {
        classCallCheck(this, Interface);

        this._namespace = namespace;
    }

    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */


    createClass(Interface, [{
        key: '_record',
        value: function _record(level, descriptor, data) {
            throwError('method _record is not implemented.');
        }

        /**
         * add a level-info record
         * @method info
         * @param {String} descriptor - to speed up search and improve understanding
         * @param {Mixed} [data] - additional data
         */

    }, {
        key: 'info',
        value: function info() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this._record.apply(this, ['info'].concat(args));
        }

        /**
         * add a level-warn record
         * @method warn
         * @param {String} descriptor - to speed up search and improve understanding
         * @param {Mixed} [data] - additional data
         */

    }, {
        key: 'warn',
        value: function warn() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            this._record.apply(this, ['warn'].concat(args));
        }

        /**
         * add a level-error record
         * @method error
         * @param {String} descriptor - to speed up search and improve understanding
         * @param {Mixed} [data] - additional data
         */

    }, {
        key: 'error',
        value: function error() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            this._record.apply(this, ['error'].concat(args));
        }

        /**
         * add a level-critical record
         * @method critical
         * @param {String} descriptor - to speed up search and improve understanding
         * @param {Mixed} [data] - additional data
         */

    }, {
        key: 'critical',
        value: function critical() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            this._record.apply(this, ['critical'].concat(args));
        }

        /**
         * initialize protocol
         * @method init
         * @static
         * @param {String} database - database name to use
         */

    }], [{
        key: 'init',
        value: function init(database) {
            return true;
        }

        /**
         * transform human readable time string, such as '3d', '.3' and '1.2' into Unix timestamp
         * the default relative time is Date.now(), if no second parameter is provided
         * @method transTimeFormat
         * @static
         * @param {String} time - time string to transform
         * @param {Number} [relative] - relative time to compare, default Date.now()
         * @return {Number|NaN} timestamp transformed
         */

    }, {
        key: 'transTimeFormat',
        value: function transTimeFormat(time, relative) {
            // if falsy value or timestamp already, pass it through directly,
            if (!time || /^\d{13}$/.test(time)) {
                return +time;
            }
            // incase relative time isn't unix timestamp format,
            // neither a falsy value which will turned out to be Date.now()
            if (relative && !/^\d{13}$/.test(relative)) {
                throw new TypeError('relative time should be standard unix timestamp');
            }

            return (relative || Date.now()) - time.replace(/d$/, '') * 24 * 3600 * 1000;
        }

        /**
         * get logs in range
         * if from and end is not defined, will fetch full log
         * @method get
         * @static
         * @param {String} from - time from, unix timestamp
         * @param {String} to - time end, unix timestamp
         * @param {Function} readyFn - function to call back with logs as parameter
         */

    }, {
        key: 'get',
        value: function get$$1(from, to, readyFn) {
            throwError('method get is not implemented.');
        }

        /**
         * clean logs = keep limited logs
         * @method keep
         * @static
         * @param {Number} daysToMaintain - keep logs within days
         */

    }, {
        key: 'keep',
        value: function keep(daysToMaintain) {
            throwError('method keep is not implemented.');
        }

        /**
         * delete log database
         * @method clean
         * @static
         */

    }, {
        key: 'clean',
        value: function clean() {
            throwError('method clean is not implemented.');
        }

        /**
         * protocol status map
         * @prop {Object} STATUS
         */

    }, {
        key: 'STATUS',
        get: function get$$1() {
            return {
                INITING: 1,
                INITED: 2,
                FAILED: 4
            };
        }
    }]);
    return Interface;
}();

/**
 * Pool, for storage of async calling
 * @class Pool
 */
var Pool = function () {
    /**
     * Pool constructor
     * @constructor
     */
    function Pool() {
        classCallCheck(this, Pool);

        this._pool = [];
    }

    /**
     * add an procedure
     * @method push
     * @param {Function} handler - procedure handler
     * @param {Object} context - procedure context
     */


    createClass(Pool, [{
        key: "push",
        value: function push(handler, context) {
            handler.context = context;
            this._pool.push(handler);
        }

        /**
         * consume pool
         * @method consume
         */

    }, {
        key: "consume",
        value: function consume() {
            var handler;
            while (handler = this._pool.shift()) {
                handler.call(handler.context);
            }
        }
    }]);
    return Pool;
}();

var READ_WRITE = 'readwrite';

/**
 * IndexedDB protocol
 * @class IndexedDBLogger
 */

var IndexedDBLogger = function (_LoggerInterface) {
    inherits(IndexedDBLogger, _LoggerInterface);

    /**
     * IndexedDB protocol constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function IndexedDBLogger() {
        var _ref;

        classCallCheck(this, IndexedDBLogger);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return possibleConstructorReturn(this, (_ref = IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger)).call.apply(_ref, [this].concat(args)));
    }

    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */


    createClass(IndexedDBLogger, [{
        key: '_record',
        value: function _record(level, descriptor, data) {
            var _this2 = this;

            try {
                if (IndexedDBLogger.status !== Interface.STATUS.INITED) {
                    IndexedDBLogger._pool.push(function () {
                        return _this2._record(level, descriptor, data);
                    });
                    if (IndexedDBLogger.status !== Interface.STATUS.INITING) {
                        IndexedDBLogger.init();
                    }
                    return;
                }

                debug(this._namespace, level, descriptor, data);
                var transaction = IndexedDBLogger.db.transaction(['logs'], READ_WRITE || 'readwrite');
                transaction.onerror = function (event) {
                    return throwError(event.target.error);
                };

                var store = transaction.objectStore('logs');
                // should not contains any function in data
                // otherwise 'DOMException: Failed to execute 'add' on 'IDBObjectStore': An object could not be cloned.' will be thrown
                var request = store.add({
                    time: Date.now(),
                    level: level,
                    namespace: this._namespace,
                    descriptor: descriptor,
                    data: filterFunction(data)
                });

                request.onerror = function (event) {
                    IndexedDBLogger.status = Interface.STATUS.FAILED;
                    throwError(event.target.error);
                };
            } catch (e) {
                throwError('failed to write, ' + e.message);
            }
        }

        /**
         * initialize protocol
         * @method init
         * @static
         * @param {String} database - database name to use
         */

    }], [{
        key: 'init',
        value: function init(database) {
            var _this3 = this;

            try {
                if (!IndexedDBLogger.support) {
                    throwError('your platform does not support indexeddb protocol.');
                }

                if (IndexedDBLogger.status) {
                    return false;
                }

                IndexedDBLogger._pool = IndexedDBLogger._pool || new Pool();
                IndexedDBLogger._database = database || 'logline';
                IndexedDBLogger.status = get$1(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITING;

                IndexedDBLogger.request = window.indexedDB.open(IndexedDBLogger._database);
                IndexedDBLogger.request.onerror = function (event) {
                    return throwError('protocol indexeddb is prevented.');
                };
                IndexedDBLogger.request.onsuccess = function (event) {
                    IndexedDBLogger.db = event.target.result;
                    IndexedDBLogger.status = get$1(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', _this3).INITED;
                    IndexedDBLogger._pool.consume();
                    // globally handle db request errors
                    IndexedDBLogger.db.onerror = function (event) {
                        return throwError(event.target.error);
                    };
                };
                IndexedDBLogger.request.onupgradeneeded = function (event) {
                    // init dabasebase
                    var db = event.target.result,
                        store = db.createObjectStore('logs', { autoIncrement: true });
                    store.createIndex('namespace', 'namespace', { unique: false });
                    store.createIndex('level', 'level', { unique: false });
                    store.createIndex('descriptor', 'descriptor', { unique: false });
                    store.createIndex('data', 'data', { unique: false });
                };
            } catch (e) {
                throwError('failed init, ' + e.message);
            }
        }

        /**
         * get logs in range
         * if from and end is not defined, will fetch full log
         * @method get
         * @static
         * @param {String} [from] - time from, unix time stamp or falsy
         * @param {String} [to] - time end, unix time stamp or falsy
         * @param {Function} readyFn - function to call back with logs as parameter
         */

    }, {
        key: 'get',
        value: function get$$1(from, to, readyFn) {
            try {
                if (IndexedDBLogger.status !== get$1(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITED) {
                    return IndexedDBLogger._pool.push(function () {
                        return IndexedDBLogger.get(from, to, readyFn);
                    });
                }

                from = Interface.transTimeFormat(from);
                to = Interface.transTimeFormat(to);

                var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY);
                if (!store) {
                    return readyFn([]);
                }

                // IDBObjectStore.getAll is a non-standard API
                if (store.getAll) {
                    var result = void 0,
                        logs = [];
                    store.getAll().onsuccess = function (event) {
                        result = event.target.result;
                        for (var i = 0; i < result.length; i++) {
                            if (from && result[i].time < from || to && result[i].time > to) {
                                continue;
                            }
                            logs.push(result[i]);
                        }
                        readyFn(logs);
                    };
                } else {
                    var request = store.openCursor(),
                        _logs = [];
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            if (from && cursor.value.time < from || to && cursor.value.time > to) {
                                return cursor.continue();
                            }

                            _logs.push({
                                time: cursor.value.time,
                                level: cursor.value.level,
                                namespace: cursor.value.namespace,
                                descriptor: cursor.value.descriptor,
                                data: cursor.value.data
                            });
                            cursor.continue();
                        } else {
                            readyFn(_logs);
                        }
                    };
                }
            } catch (e) {
                throwError('failed to get logs, ' + e.message);
            }
        }

        /**
         * clean logs = keep limited logs
         * @method keep
         * @static
         * @param {Number} daysToMaintain - keep logs within days
         */

    }, {
        key: 'keep',
        value: function keep(daysToMaintain) {
            try {
                if (IndexedDBLogger.status !== get$1(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITED) {
                    return IndexedDBLogger._pool.push(function () {
                        return IndexedDBLogger.keep(daysToMaintain);
                    });
                }

                var store = IndexedDBLogger._getTransactionStore(READ_WRITE);
                if (!store) {
                    return false;
                }
                if (!daysToMaintain) {
                    var request = store.clear().onerror = function (event) {
                        return throwError(event.target.error);
                    };
                } else {
                    var range = Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000;
                    var _request = store.openCursor();
                    _request.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor && cursor.value.time < range) {
                            store.delete(cursor.primaryKey);
                            cursor.continue();
                        }
                    };
                    _request.onerror = function (event) {
                        return throwError('unable to locate logs earlier than ' + daysToMaintain + 'd.');
                    };
                }
            } catch (e) {
                throwError('failed to keep logs, ' + e.message);
            }
        }

        /**
         * delete log database
         * @method clean
         * @static
         */

    }, {
        key: 'clean',
        value: function clean() {
            try {
                if (IndexedDBLogger.status !== get$1(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITED) {
                    return IndexedDBLogger._pool.push(function () {
                        return IndexedDBLogger.clean();
                    });
                }

                // database can be removed only after all connections are closed
                IndexedDBLogger.db.close();
                var request = window.indexedDB.deleteDatabase(IndexedDBLogger._database);
                request.onerror = function (event) {
                    return throwError(event.target.error);
                };
                /* eslint no-unused-vars: "off" */
                request.onsuccess = function (event) {
                    delete IndexedDBLogger.status;
                    delete IndexedDBLogger.db;
                };
            } catch (e) {
                throwError('failed to cleanup logs, ' + e.message);
            }
        }

        /**
         * get internal transaction store
         * @method _getTransactionStore
         * @private
         * @static
         * @param {String} mode - transaction mode
         * @return {Object} - internal object store
         */

    }, {
        key: '_getTransactionStore',
        value: function _getTransactionStore(mode) {
            try {
                if (IndexedDBLogger.db) {
                    var transaction = IndexedDBLogger.db.transaction(['logs'], mode || READ_WRITE);
                    transaction.onerror = function (event) {
                        return throwError(event.target.error);
                    };
                    return transaction.objectStore('logs');
                } else {
                    throwError('log database is not created or connections are closed, considering init it.');
                }
            } catch (e) {
                throwError('failed to generate new transaction, ' + e.message);
                return false;
            }
        }

        /**
         * detect support situation
         * @prop {Boolean} support
         */

    }, {
        key: 'support',
        get: function get$$1() {
            var support = !!(window.indexedDB && window.IDBTransaction && window.IDBKeyRange);
            return support;
        }
    }]);
    return IndexedDBLogger;
}(Interface);

/**
 * Localstorage protocol
 * @class LocalStorageLogger
 */

var LocalStorageLogger = function (_LoggerInterface) {
    inherits(LocalStorageLogger, _LoggerInterface);

    /**
     * Localstorage protocol constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function LocalStorageLogger() {
        var _ref;

        classCallCheck(this, LocalStorageLogger);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return possibleConstructorReturn(this, (_ref = LocalStorageLogger.__proto__ || Object.getPrototypeOf(LocalStorageLogger)).call.apply(_ref, [this].concat(args)));
    }

    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */


    createClass(LocalStorageLogger, [{
        key: '_record',
        value: function _record(level, descriptor, data) {
            var logs;
            try {
                logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
                logs.push([Date.now(), this._namespace, level, descriptor, data]);
                debug(this._namespace, level, descriptor, data);
                window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
            } catch (e) {
                throwError('failed to write, ' + e.message);
            }
        }

        /**
         * initialize protocol
         * @method init
         * @static
         * @param {String} database - database name to use
         */

    }], [{
        key: 'init',
        value: function init(database) {
            try {
                if (!LocalStorageLogger.support) {
                    throwError('your platform does not support localstorage protocol.');
                }
                LocalStorageLogger._database = database || 'logline';
                if (!window.localStorage.getItem(LocalStorageLogger._database)) {
                    window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify([]));
                }
                LocalStorageLogger.status = get$1(LocalStorageLogger.__proto__ || Object.getPrototypeOf(LocalStorageLogger), 'STATUS', this).INITED;
            } catch (e) {
                throwError('failed to init, ' + e.message);
            }
        }

        /**
         * get logs in range
         * if from and end is not defined, will fetch full log
         * @method get
         * @static
         * @param {String} from - time from, unix time stamp or falsy
         * @param {String} to - time end, unix time stamp or falsy
         * @param {Function} readyFn - function to call back with logs as parameter
         */

    }, {
        key: 'get',
        value: function get$$1(from, to, readyFn) {
            var logs, i;
            try {
                logs = JSON.parse(window.localStorage.getItem(LocalStorageLogger._database));

                from = Interface.transTimeFormat(from);
                to = Interface.transTimeFormat(to);

                for (i = 0; i < logs.length; i++) {
                    if (from && logs[i][0] < from || to && logs[i][0] > to) {
                        continue;
                    }

                    logs[i] = {
                        time: logs[i][0],
                        namespace: logs[i][1],
                        level: logs[i][2],
                        descriptor: logs[i][3],
                        data: logs[i][4]
                    };
                }
                readyFn(logs);
            } catch (e) {
                throwError('failed to get, ' + e.message);
                readyFn([]);
            }
        }

        /**
         * clean logs = keep limited logs
         * @method keep
         * @static
         * @param {Number} daysToMaintain - keep logs within days
         */

    }, {
        key: 'keep',
        value: function keep(daysToMaintain) {
            var logs;
            try {
                logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(function (log) {
                    return log.time >= Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000;
                });
                window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
            } catch (e) {
                throwError('failed to keep, ' + e.message);
            }
        }

        /**
         * delete log database
         * @method clean
         * @static
         */

    }, {
        key: 'clean',
        value: function clean() {
            try {
                delete LocalStorageLogger.status;
                window.localStorage.removeItem(LocalStorageLogger._database);
            } catch (e) {
                throwError('failed to clean, ' + e.message);
            }
        }

        /**
         * detect support situation
         * @prop {Boolean} support
         */

    }, {
        key: 'support',
        get: function get$$1() {
            return 'localStorage' in window;
        }
    }]);
    return LocalStorageLogger;
}(Interface);

/**
 * Websql protocol
 * @class WebsqlLogger
 */

var WebsqlLogger = function (_LoggerInterface) {
    inherits(WebsqlLogger, _LoggerInterface);

    /**
     * Websql logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    function WebsqlLogger() {
        var _ref;

        classCallCheck(this, WebsqlLogger);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return possibleConstructorReturn(this, (_ref = WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger)).call.apply(_ref, [this].concat(args)));
    }

    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */


    createClass(WebsqlLogger, [{
        key: '_record',
        value: function _record(level, descriptor, data) {
            var _this2 = this;

            if (WebsqlLogger.status !== Interface.STATUS.INITED) {
                WebsqlLogger._pool.push(function () {
                    return _this2._record(level, descriptor, data);
                });
                if (WebsqlLogger.status !== Interface.STATUS.INITING) {
                    WebsqlLogger.init();
                }
                return;
            }

            try {
                debug(this._namespace, level, descriptor, data);
                WebsqlLogger._db.transaction(function (tx) {
                    tx.executeSql('INSERT INTO logs (time, namespace, level, descriptor, data) VALUES(?, ?, ?, ? ,?)', [Date.now(), _this2._namespace, level, descriptor, data === undefined || data === '' ? '' : JSON.stringify(data) || ''], function () {/* empty func */}, function (tx, e) {
                        throwError('write error, ' + e.message);
                    });
                });
            } catch (e) {
                throwError('error inserting record, ' + e.message);
            }
        }

        /**
         * initialize protocol
         * @method init
         * @static
         * @param {String} database - database name to use
         */

    }], [{
        key: 'init',
        value: function init(database) {
            var _this3 = this;

            if (!WebsqlLogger.support) {
                throwError(new Error('your platform does not support websql protocol.'));
            }

            if (WebsqlLogger.status) {
                return false;
            }

            WebsqlLogger._pool = WebsqlLogger._pool || new Pool();
            WebsqlLogger._database = database || 'logline';
            WebsqlLogger.status = get$1(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITING;

            try {
                WebsqlLogger._db = window.openDatabase(WebsqlLogger._database, '1.0', 'cats loves logs', 4.85 * 1024 * 1024);
                WebsqlLogger._db.transaction(function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)', [], function () {
                        WebsqlLogger.status = get$1(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', _this3).INITED;
                        WebsqlLogger._pool.consume();
                    }, function (tx, e) {
                        WebsqlLogger.status = get$1(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', _this3).FAILED;
                        throwError('unable to create table, ' + e.message);
                    });
                });
            } catch (e) {
                throwError('unable to init log database, ' + e.message);
            }
        }

        /**
         * get logs in range
         * if from and end is not defined, will fetch full log
         * @method get
         * @static
         * @param {String} from - time from, unix time stamp or falsy
         * @param {String} to - time end, unix time stamp or falsy
         * @param {Function} readyFn - function to call back with logs as parameter
         */

    }, {
        key: 'get',
        value: function get$$1(from, to, readyFn) {
            if (WebsqlLogger.status !== get$1(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITED) {
                return WebsqlLogger._pool.push(function () {
                    return WebsqlLogger.get(from, to, readyFn);
                });
            }

            from = Interface.transTimeFormat(from);
            to = Interface.transTimeFormat(to);

            try {
                WebsqlLogger._db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM logs ORDER BY time DESC', [], function (tx, res) {
                        var logs = [],
                            line,
                            index = res.rows.length,
                            item;
                        while (--index >= 0) {
                            item = res.rows.item(index);
                            if (from && item.time < from || to && item.time > to) {
                                continue;
                            }

                            // in some devices, properties are configureable: false, writable: false
                            // we need deep copy
                            line = JSON.parse(JSON.stringify(item));
                            // incase data is an object, not a string
                            try {
                                line.data = JSON.parse(line.data);
                            } catch (e) {/* leave line.data as it be */}
                            logs.push(line);
                        }
                        readyFn(logs);
                    }, function (tx, e) {
                        throwError(e.message);
                    });
                });
            } catch (e) {
                throwError('unable to collect logs from database.');
            }
        }

        /**
         * clean logs = keep limited logs
         * @method keep
         * @static
         * @param {Number} daysToMaintain - keep logs within days
         */

    }, {
        key: 'keep',
        value: function keep(daysToMaintain) {
            if (WebsqlLogger.status !== get$1(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITED) {
                return WebsqlLogger._pool.push(function () {
                    return WebsqlLogger.keep(daysToMaintain);
                });
            }

            try {
                WebsqlLogger._db.transaction(function (tx) {
                    if (daysToMaintain) {
                        tx.executeSql('DELETE FROM logs WHERE time < ?', [Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000], function () {/* empty func */}, function (tx, e) {
                            throwError(e.message);
                        });
                    } else {
                        tx.executeSql('DELETE FROM logs', [], function () {/* empty func */}, function (tx, e) {
                            throwError(e.message);
                        });
                    }
                });
            } catch (e) {
                throwError('unable to clean logs from database.');
            }
        }

        /**
         * delete log database
         * @method clean
         * @static
         */

    }, {
        key: 'clean',
        value: function clean() {
            if (WebsqlLogger.status !== get$1(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITED) {
                WebsqlLogger._pool.push(function () {
                    return WebsqlLogger.clean();
                });
                return;
            }

            try {
                WebsqlLogger._db.transaction(function (tx) {
                    tx.executeSql('DROP TABLE logs', [], function () {
                        delete WebsqlLogger.status;
                    }, function (tx, e) {
                        throwError(e.message);
                    });
                });
            } catch (e) {
                throwError('unable to clean log database.');
            }
        }

        /**
         * detect support situation
         * @prop {Boolean} support
         */

    }, {
        key: 'support',
        get: function get$$1() {
            return 'openDatabase' in window;
        }
    }]);
    return WebsqlLogger;
}(Interface);

var Logline = function () {
    /**
     * Logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     * @return {Object Protocol Instance}
     */
    function Logline(namespace) {
        classCallCheck(this, Logline);

        if (!(this instanceof Logline)) {
            return new Logline(namespace);
        }
        try {
            Logline._checkProtocol();
            return new Logline._protocol(namespace);
        } catch (e) {
            return new Interface(namespace);
        }
    }

    /**
     * change config
     * @method config
     * @param {String|Object} key - config key, or config object
     * @param {Any} [value] - new config value
     * @return {Void}
     */


    createClass(Logline, null, [{
        key: '_initProtocol',


        /**
         * choose a protocol to initialize
         * @method _initProtocol
         * @private
         * @static
         * @param {Object Protocol Class} protocol - protocol to use, must under Logline.PROTOCOL
         * @return {Object} Logline
         */
        value: function _initProtocol(protocol) {
            Logline._protocol = protocol;
            Logline._protocol.init(Logline._database || 'logline');
        }

        /**
         * check protocol
         * if no protocol is chosen, will try to choose an available one automatically
         * if none of the protocols is available, an error will be thrown
         * @method _checkProtocol
         * @private
         * @static
         */

    }, {
        key: '_checkProtocol',
        value: function _checkProtocol() {
            if (!Logline._protocol) {
                var protocols = Object.keys(Logline.PROTOCOL),
                    protocol = void 0;
                while (protocol = Logline.PROTOCOL[protocols.shift()]) {
                    if (protocol.support) {
                        Logline._initProtocol(protocol);
                        return;
                    }
                }

                throwError('protocols ' + protocols.join(', ').toLowerCase() + ' are not supported on this platform');
            }
        }

        /**
         * get logs in range
         * if from and end is not defined, will fetch full log
         * @method get
         * @static
         * @param {String} [from] - time from
         * @param {String} [to] - time end
         * @param {Function} readyFn - function to call back with logs as parameter
         */

    }, {
        key: 'get',
        value: function get$$1(from, to, readyFn) {
            Logline._checkProtocol();

            switch (arguments.length) {
                case 1:
                    readyFn = from;
                    from = undefined;
                    break;
                case 2:
                    readyFn = to;
                    to = undefined;
                    break;
                case 3:
                default:
                    break;
            }

            Logline._protocol.get(from, to, readyFn);
        }

        /**
         * read all logs
         * @method all
         * @static
         * @param {Function} readyFn - function to call back with logs as parameter
         */

    }, {
        key: 'all',
        value: function all(readyFn) {
            Logline.get(readyFn);
        }

        /**
         * clean up logs = keep limited logs
         * @method keep
         * @static
         * @param {String} daysToMaintain - specialfy days to keep, support human readable format such as '3d', '.3'
         * @return {Object} Logline
         */

    }, {
        key: 'keep',
        value: function keep(daysToMaintain) {
            Logline._checkProtocol();
            Logline._protocol.keep(daysToMaintain);
            return this;
        }

        /**
         * delete log database
         * @method clean
         * @static
         * @return {Object} Logline
         */

    }, {
        key: 'clean',
        value: function clean() {
            Logline._checkProtocol();
            Logline._protocol.clean();
            return this;
        }

        /**
         * choose a protocol
         * @method using
         * @static
         * @param {Object Protocol Class} protocol - wanted protocol, should be on of Logline.PROTOCOL
         * @param {String} [database] - custome database name
         * @return {Object} Logline
         */

    }, {
        key: 'using',
        value: function using(protocol, database) {
            // protocol unavailable is not allowed
            if (-1 === [IndexedDBLogger, LocalStorageLogger, WebsqlLogger].indexOf(protocol)) {
                throwError('specialfied protocol ' + (protocol ? protocol + ' ' : '') + 'is not available');
            }

            // once protocol is selected, it shall not be changed during runtime
            if (Logline._protocol) {
                return this;
            }

            Logline.database(database || Logline._database);
            Logline._initProtocol(protocol);
            return this;
        }

        /**
         * specialfy a custome database name, in case of any conflicts
         * @methd database
         * @static
         * @param {String} name - target database name
         */

    }, {
        key: 'database',
        value: function database(name) {
            Logline._database = name;
        }
    }, {
        key: 'config',
        get: function get$$1() {
            return config;
        }
    }]);
    return Logline;
}();

// export protocols for modification and mounting


Logline.PROTOCOL = {
    INDEXEDDB: IndexedDBLogger,
    LOCALSTORAGE: LocalStorageLogger,
    WEBSQL: WebsqlLogger
};

// export protocol interface for user custom implements
Logline.INTERFACE = Object.freeze(Interface);

// export Logline env, just like Unix Environment variables
Logline.env = {
    verbose: true
};

return Logline;

})));
