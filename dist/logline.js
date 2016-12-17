/*!
 * logline v1.0.2 (https://github.com/latel/logline#readme)
 * Copyright 2016, latel <latelx64@gmail.com>
 * MIT license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Logline"] = factory();
	else
		root["Logline"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _indexeddb = __webpack_require__(1);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _websql = __webpack_require__(5);

	var _websql2 = _interopRequireDefault(_websql);

	var _localstorage = __webpack_require__(6);

	var _localstorage2 = _interopRequireDefault(_localstorage);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Logline = function () {
	    function Logline(namespace) {
	        _classCallCheck(this, Logline);

	        Logline._checkProtocol();
	        return new Logline._protocol(namespace);
	    }

	    // 选择并初始化协议


	    _createClass(Logline, null, [{
	        key: '_initProtocol',
	        value: function _initProtocol(protocol) {
	            Logline._protocol = protocol;
	            Logline._protocol.init(Logline._database || 'logline');
	        }

	        // 检查协议

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

	                throw new Error(protocols.join(', ').toLowerCase() + ' protocols are not supported on this platform');
	            }
	        }

	        // 获取所有日志

	    }, {
	        key: 'getAll',
	        value: function getAll(readyFn) {
	            Logline._checkProtocol();
	            Logline._protocol.all(function (logs) {
	                return readyFn(logs);
	            });
	        }

	        // 清理日志

	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            Logline._checkProtocol();
	            Logline._protocol.keep(daysToMaintain);
	            return this;
	        }

	        // 清空日志并删除数据库

	    }, {
	        key: 'clean',
	        value: function clean() {
	            Logline._checkProtocol();
	            Logline._protocol.clean();
	            return this;
	        }

	        // 选择一个日志协议

	    }, {
	        key: 'using',
	        value: function using(protocol, database) {
	            // protocol unavailable is not allowed
	            if (-1 === [_indexeddb2.default, _websql2.default, _localstorage2.default].indexOf(protocol)) {
	                util.throwError('specialfied protocol ' + (protocol ? protocol + ' ' : '') + 'is not available');
	            }

	            // once protocol is selected, it shall not be changed during runtime
	            if (Logline._protocol) {
	                return this;
	            }

	            Logline.database(database || Logline._database);
	            Logline._initProtocol(protocol);
	            return this;
	        }
	    }, {
	        key: 'database',
	        value: function database(name) {
	            Logline._database = name;
	        }
	    }]);

	    return Logline;
	}();

	Logline.PROTOCOL = {
	    INDEXEDDB: _indexeddb2.default,
	    WEBSQL: _websql2.default,
	    LOCALSTORAGE: _localstorage2.default
	};

	module.exports = Logline;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	var _pool = __webpack_require__(4);

	var _pool2 = _interopRequireDefault(_pool);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * indexedDB日志协议
	 * @class IndexedDBLogger
	 */
	var IndexedDBLogger = function (_LoggerInterface) {
	    _inherits(IndexedDBLogger, _LoggerInterface);

	    /**
	     * 构造函数
	     * @constructor
	     * @param {String} namespace - 日志的命名空间
	     */
	    function IndexedDBLogger() {
	        var _ref;

	        _classCallCheck(this, IndexedDBLogger);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _possibleConstructorReturn(this, (_ref = IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger)).call.apply(_ref, [this].concat(args)));
	    }

	    /**
	     * 添加一条日志记录
	     * @method _reocrd
	     * @private
	     * @parma {String} level - 日志等级
	     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	     * @param {Mixed} data - 要记录的附加数据
	     */


	    _createClass(IndexedDBLogger, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            var _this2 = this;

	            if (IndexedDBLogger.status !== _interface2.default.STATUS.INITED) {
	                IndexedDBLogger._pool.push(function () {
	                    _this2._record(level, descriptor, data);
	                });
	                if (IndexedDBLogger.status !== _interface2.default.STATUS.INITING) {
	                    IndexedDBLogger.init();
	                }
	                return;
	            }

	            var transaction = IndexedDBLogger.db.transaction(['logs'], IDBTransaction.READ_WRITE || 'readwrite');
	            transaction.onerror = function (event) {
	                return util.throwError(event.target.error);
	            };

	            var store = transaction.objectStore('logs');
	            var request = store.add({
	                time: Date.now(),
	                namespace: this._namesapce,
	                descriptor: descriptor,
	                data: data
	            });

	            request.onerror = function (event) {
	                IndexedDBLogger.status = _interface2.default.STATUS.FAILED;
	                util.throwError(event.target.error);
	            };
	        }

	        /**
	         * 初始化协议
	         * @method init
	         * @static
	         * @param {String} database - 初始化时要使用的数据库名
	         */

	    }], [{
	        key: 'init',
	        value: function init(database) {
	            var _this3 = this;

	            if (!IndexedDBLogger.support) {
	                util.throwError('your platform does not support indexeddb protocol.');
	            }

	            if (IndexedDBLogger.status) {
	                return false;
	            }

	            IndexedDBLogger._pool = IndexedDBLogger._pool || new _pool2.default();
	            IndexedDBLogger._database = database || 'logline';
	            IndexedDBLogger.status = _get(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITING;

	            IndexedDBLogger.request = window.indexedDB.open(IndexedDBLogger._database);
	            IndexedDBLogger.request.onerror = function (event) {
	                return util.throwError('protocol indexeddb is prevented.');
	            };
	            IndexedDBLogger.request.onsuccess = function (event) {
	                IndexedDBLogger.db = event.target.result;
	                IndexedDBLogger.status = _get(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', _this3).INITED;
	                IndexedDBLogger._pool.consume();
	                // globally handle db request errors
	                IndexedDBLogger.db.onerror = function (event) {
	                    return util.throwError(event.target.error);
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
	        }

	        /**
	         * 读取所有日志内容
	         * @method all
	         * @static
	         * @param {Function} readyFn - 用于读取日志内容的回调函数
	         */

	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            if (IndexedDBLogger.status !== _get(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITED) {
	                IndexedDBLogger._pool.push(function () {
	                    IndexedDBLogger.all(readyFn);
	                });
	                return;
	            }

	            var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY || 'readonly'),
	                request = store.openCursor(),
	                logs = [];

	            request.onsuccess = function (event) {
	                var cursor = event.target.result;
	                console && console.log(cursor);
	                if (cursor) {
	                    logs.push({
	                        time: cursor.value.time,
	                        namespace: cursor.value.namespace,
	                        descriptor: cursor.value.descriptor,
	                        data: cursor.value.data
	                    });
	                    cursor.continue();
	                } else {
	                    readyFn(logs);
	                }
	            };

	            request.onerror = function (event) {
	                return util.throwError('failed to literat on logs from database.');
	            };
	        }

	        /**
	         * 清理日志
	         * @method keep
	         * @static
	         * @param {Number} daysToMaintain - 保留多少天数的日志
	         */

	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            if (IndexedDBLogger.status !== _get(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITED) {
	                IndexedDBLogger._pool.push(function () {
	                    IndexedDBLogger.keep(daysToMaintain);
	                });
	                return;
	            }

	            var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_WRITE);
	            if (!daysToMaintain) {
	                var request = store.clear().onerror = function (event) {
	                    return util.throwError(event.target.error);
	                };
	            } else {
	                var range = IDBKeyRange.upperBound(Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000, true);
	                var _request = store.openCursor(range);
	                _request.onsuccess = function (event) {
	                    var cursor = event.target.result;
	                    if (cursor) {
	                        store.delete(cursor.primaryKey);
	                        cursor.continue();
	                    }
	                };
	                _request.onerror = function (event) {
	                    return util.throwError('unable to locate logs earlier than ' + daysToMaintain + 'd.');
	                };
	            }
	        }

	        /**
	         * 删除日志数据库
	         * @method clean
	         * @static
	         */

	    }, {
	        key: 'clean',
	        value: function clean() {
	            if (IndexedDBLogger.status !== _get(IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger), 'STATUS', this).INITED) {
	                IndexedDBLogger._pool.push(function () {
	                    IndexedDBLogger.clean();
	                });
	                return;
	            }

	            // database can be removed only after all connections are closed
	            IndexedDBLogger.db.close();
	            var request = window.indexedDB.deleteDatabase(IndexedDBLogger._database);
	            request.onerror = function (event) {
	                return util.throwError(event.target.error);
	            };
	            /* eslint no-unused-vars: "off" */
	            request.onsuccess = function (event) {
	                delete IndexedDBLogger.status;
	                delete IndexedDBLogger.db;
	            };
	        }

	        /**
	         * 获取事务存储过程
	         * @method _getTransactionStore
	         * @private
	         * @static
	         * @param {String} mode - 事务过程的参数
	         * @return {Object} 实物存储过程
	         */

	    }, {
	        key: '_getTransactionStore',
	        value: function _getTransactionStore(mode) {
	            if (IndexedDBLogger.db) {
	                var transaction = IndexedDBLogger.db.transaction(['logs'], mode || IDBTransaction.READ_WRITE || 'readwrite');
	                transaction.onerror = function (event) {
	                    return util.throwError(event.target.error);
	                };
	                return transaction.objectStore('logs');
	            } else {
	                util.throwError('log database is not created or connections is closed, considering init it.');
	            }
	        }

	        /**
	         * 是否支持indexedDB
	         * @prop {Boolean} support
	         */

	    }, {
	        key: 'support',
	        get: function get() {
	            return !!(window.indexedDB && window.IDBTransaction && window.IDBKeyRange);
	        }
	    }]);

	    return IndexedDBLogger;
	}(_interface2.default);

	exports.default = IndexedDBLogger;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 日志协议原型类
	 * @class Interface
	 */
	var Interface = function () {
	    /**
	     * 构造函数
	     * @constructor
	     * @param {String} namespace - 日志的命名空间
	     */
	    function Interface(namespace) {
	        _classCallCheck(this, Interface);

	        this._namesapce = namespace;
	    }

	    /**
	     * 添加一条日志记录
	     * @method _reocrd
	     * @private
	     * @parma {String} level - 日志等级
	     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	     * @param {Mixed} data - 要记录的附加数据
	     */


	    _createClass(Interface, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            util.throwError('method _record is not implemented.');
	        }

	        /**
	         * 添加一条等级为info的日志记录
	         * @method info
	         * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	         * @param {Mixed} data - 要记录的附加数据
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
	         * 添加一条等级为warn的日志记录
	         * @method warn
	         * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	         * @param {Mixed} data - 要记录的附加数据
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
	         * 添加一条等级为error的日志记录
	         * @method error
	         * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	         * @param {Mixed} data - 要记录的附加数据
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
	         * 添加一条等级为critical的日志记录
	         * @method critical
	         * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	         * @param {Mixed} data - 要记录的附加数据
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
	         * 初始化协议
	         * @method init
	         * @static
	         * @param {String} database - 初始化时要使用的数据库名
	         */

	    }], [{
	        key: 'init',
	        value: function init(database) {
	            return true;
	        }

	        /**
	         * 读取所有日志内容
	         * @method all
	         * @static
	         * @param {Function} readyFn - 用于读取日志内容的回调函数
	         */

	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            readyFn([]);
	        }

	        /**
	         * 清理日志
	         * @method keep
	         * @static
	         * @param {Number} daysToMaintain - 保留多少天数的日志
	         */

	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            return true;
	        }

	        /**
	         * 删除日志数据库
	         * @method clean
	         * @static
	         */

	    }, {
	        key: 'clean',
	        value: function clean() {
	            return true;
	        }

	        /**
	         * 协议状态MAP
	         * @prop {Object} STATUS
	         */

	    }, {
	        key: 'STATUS',
	        get: function get() {
	            return {
	                INITING: 1, // 初始化中
	                INITED: 2, // 初始化成功
	                FAILED: 4 // 初始化失败
	            };
	        }
	    }]);

	    return Interface;
	}();

	exports.default = Interface;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.throwError = throwError;
	// 抛出Error错误，并在错误描述前统一添加'Logline: '
	function throwError(errMessage) {
	    throw new Error('Logline: ' + errMessage);
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 队列池，用于异步调用过程的寄存
	 * @class Pool
	 */
	var Pool = function () {
	    /**
	     * 队列池构造器
	     * @constructor
	     */
	    function Pool() {
	        _classCallCheck(this, Pool);

	        this._pool = [];
	    }

	    /**
	     * 向队列中添加过程
	     * @method push
	     * @param {Function} handler - 过程函数
	     * @param {Object} context - 过程函数的上下文
	     */


	    _createClass(Pool, [{
	        key: "push",
	        value: function push(handler, context) {
	            handler.context = context;
	            this._pool.push(handler);
	        }

	        /**
	         * 消费队列
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

	exports.default = Pool;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	var _pool = __webpack_require__(4);

	var _pool2 = _interopRequireDefault(_pool);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * websql日志协议
	 * @class WebsqlLogger
	 */
	var WebsqlLogger = function (_LoggerInterface) {
	    _inherits(WebsqlLogger, _LoggerInterface);

	    /**
	     * 构造函数
	     * @constructor
	     * @param {String} namespace - 日志的命名空间
	     */
	    function WebsqlLogger() {
	        var _ref;

	        _classCallCheck(this, WebsqlLogger);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _possibleConstructorReturn(this, (_ref = WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger)).call.apply(_ref, [this].concat(args)));
	    }

	    /**
	     * 添加一条日志记录
	     * @method _reocrd
	     * @private
	     * @parma {String} level - 日志等级
	     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	     * @param {Mixed} data - 要记录的附加数据
	     */


	    _createClass(WebsqlLogger, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            var _this2 = this;

	            if (WebsqlLogger.status !== _interface2.default.STATUS.INITED) {
	                WebsqlLogger._pool.push(function () {
	                    _this2._record(level, descriptor, data);
	                });
	                if (WebsqlLogger.status !== _interface2.default.STATUS.INITING) {
	                    WebsqlLogger.init();
	                }
	                return;
	            }

	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('INSERT INTO logs (time, namespace, level, descriptor, data) VALUES(?, ?, ?, ? ,?)', [Date.now(), _this2._namesapce, level, descriptor, data === undefined || data === '' ? '' : JSON.stringify(data) || ''], function () {/* empty func */}, function (tx, e) {
	                        throw e.message;
	                    });
	                });
	            } catch (e) {
	                util.throwError('error inserting record');
	            }
	        }

	        /**
	         * 初始化协议
	         * @method init
	         * @static
	         * @param {String} database - 初始化时要使用的数据库名
	         */

	    }], [{
	        key: 'init',
	        value: function init(database) {
	            var _this3 = this;

	            if (!WebsqlLogger.support) {
	                util.throwError(new Error('your platform does not support websql protocol.'));
	            }

	            if (WebsqlLogger.status) {
	                return false;
	            }

	            WebsqlLogger._pool = WebsqlLogger._pool || new _pool2.default();
	            WebsqlLogger._database = database || 'logline';
	            WebsqlLogger.status = _get(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITING;

	            try {
	                WebsqlLogger._db = window.openDatabase(WebsqlLogger._database, '1.0', 'cats loves logs', 4.85 * 1024 * 1024);
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)', [], function () {
	                        WebsqlLogger.status = _get(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', _this3).INITED;
	                        WebsqlLogger._pool.consume();
	                    }, function () {
	                        WebsqlLogger.status = _get(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', _this3).FAILED;
	                    });
	                });
	            } catch (e) {
	                util.throwError('unable to init log database.');
	            }
	        }

	        /**
	         * 读取所有日志内容
	         * @method all
	         * @static
	         * @param {Function} readyFn - 用于读取日志内容的回调函数
	         */

	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            if (WebsqlLogger.status !== _get(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITED) {
	                WebsqlLogger._pool.push(function () {
	                    WebsqlLogger.all(readyFn);
	                });
	                return;
	            }

	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('SELECT * FROM logs ORDER BY time DESC', [], function (tx, res) {
	                        var logs = [],
	                            line,
	                            index = res.rows.length;
	                        while (--index >= 0) {
	                            // in some devices, properties are configureable: false, writable: false
	                            // we need deep copy
	                            line = JSON.parse(JSON.stringify(res.rows.item(index)));
	                            line.data = JSON.parse(line.data);
	                            logs.push(line);
	                        }
	                        readyFn(logs);
	                    }, function (tx, e) {
	                        throw e.message;
	                    });
	                });
	            } catch (e) {
	                util.throwError('unable to collect logs from database.');
	            }
	        }

	        /**
	         * 清理日志
	         * @method keep
	         * @static
	         * @param {Number} daysToMaintain - 保留多少天数的日志
	         */

	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            if (WebsqlLogger.status !== _get(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITED) {
	                WebsqlLogger._pool.push(function () {
	                    WebsqlLogger.keep(daysToMaintain);
	                });
	                return;
	            }

	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    if (daysToMaintain) {
	                        tx.executeSql('DELETE FROM logs WHERE time < ?', [Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000], function () {/* empty func */}, function (tx, e) {
	                            throw e.message;
	                        });
	                    } else {
	                        tx.executeSql('DELETE FROM logs', [], function () {/* empty func */}, function (tx, e) {
	                            throw e.message;
	                        });
	                    }
	                });
	            } catch (e) {
	                util.throwError('unable to clean logs from database.');
	            }
	        }

	        /**
	         * 删除日志数据库
	         * @method clean
	         * @static
	         */

	    }, {
	        key: 'clean',
	        value: function clean() {
	            if (WebsqlLogger.status !== _get(WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger), 'STATUS', this).INITED) {
	                WebsqlLogger._pool.push(function () {
	                    WebsqlLogger.clean();
	                });
	                return;
	            }

	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('DROP TABLE logs', [], function () {
	                        delete WebsqlLogger.status;
	                    }, function (tx, e) {
	                        throw e.message;
	                    });
	                });
	            } catch (e) {
	                util.throwError('unable to clean log database.');
	            }
	        }

	        /**
	         * 是否支持websql
	         * @prop {Boolean} support
	         */

	    }, {
	        key: 'support',
	        get: function get() {
	            return 'openDatabase' in window;
	        }
	    }]);

	    return WebsqlLogger;
	}(_interface2.default);

	exports.default = WebsqlLogger;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * localStorage日志协议
	 * @class LocalStorageLogger
	 */
	var LocalStorageLogger = function (_LoggerInterface) {
	    _inherits(LocalStorageLogger, _LoggerInterface);

	    /**
	     * 构造函数
	     * @constructor
	     * @param {String} namespace - 日志的命名空间
	     */
	    function LocalStorageLogger() {
	        var _ref;

	        _classCallCheck(this, LocalStorageLogger);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _possibleConstructorReturn(this, (_ref = LocalStorageLogger.__proto__ || Object.getPrototypeOf(LocalStorageLogger)).call.apply(_ref, [this].concat(args)));
	    }

	    /**
	     * 添加一条日志记录
	     * @method _reocrd
	     * @private
	     * @parma {String} level - 日志等级
	     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
	     * @param {Mixed} data - 要记录的附加数据
	     */


	    _createClass(LocalStorageLogger, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            var logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
	            logs.push([Date.now(), this._namesapce, level, descriptor, data]);
	            try {
	                window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
	            } catch (e) {
	                util.throwError('error inserting record');
	            }
	        }

	        /**
	         * 初始化协议
	         * @method init
	         * @static
	         * @param {String} database - 初始化时要使用的数据库名
	         */

	    }], [{
	        key: 'init',
	        value: function init(database) {
	            if (!LocalStorageLogger.support) {
	                util.throwError('your platform does not support localstorage protocol.');
	            }
	            LocalStorageLogger._database = database || 'logline';
	            if (!window.localStorage.getItem(LocalStorageLogger._database)) {
	                window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify([]));
	            }
	            LocalStorageLogger.status = _get(LocalStorageLogger.__proto__ || Object.getPrototypeOf(LocalStorageLogger), 'STATUS', this).INITED;
	        }

	        /**
	         * 读取所有日志内容
	         * @method all
	         * @static
	         * @param {Function} readyFn - 用于读取日志内容的回调函数
	         */

	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            var logs = JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)),
	                i;
	            for (i = 0; i < logs.length; i++) {
	                logs[i] = {
	                    time: logs[i][0],
	                    namespace: logs[i][1],
	                    level: logs[i][2],
	                    descriptor: logs[i][3],
	                    data: logs[i][4]
	                };
	            }
	            readyFn(logs);
	        }

	        /**
	         * 清理日志
	         * @method keep
	         * @static
	         * @param {Number} daysToMaintain - 保留多少天数的日志
	         */

	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            var logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(function (log) {
	                return log.time >= Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000;
	            });
	            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
	        }

	        /**
	         * 删除日志数据库
	         * @method clean
	         * @static
	         */

	    }, {
	        key: 'clean',
	        value: function clean() {
	            delete LocalStorageLogger.status;
	            window.localStorage.removeItem(LocalStorageLogger._database);
	        }

	        /**
	         * 是否支持localStorage
	         * @prop {Boolean} support
	         */

	    }, {
	        key: 'support',
	        get: function get() {
	            return 'localStorage' in window;
	        }
	    }]);

	    return LocalStorageLogger;
	}(_interface2.default);

	exports.default = LocalStorageLogger;

/***/ }
/******/ ])
});
;