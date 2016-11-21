/*!
 * logline v1.0.0 (https://github.com/latel/logline#readme)
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

	var _localstorage = __webpack_require__(1);

	var _localstorage2 = _interopRequireDefault(_localstorage);

	var _websql = __webpack_require__(4);

	var _websql2 = _interopRequireDefault(_websql);

	var _indexeddb = __webpack_require__(5);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LogcatInterface = function LogcatInterface(namespace) {
	    LogcatInterface._checkProtocol();
	    return new LogcatInterface._protocol(namespace);
	};

	var Logline = function () {
	    function Logline(namespace) {
	        _classCallCheck(this, Logline);

	        Logline._checkProtocol();
	        return new Logline._protocol(namespace);
	    }

	    // 检查协议


	    _createClass(Logline, null, [{
	        key: '_checkProtocol',
	        value: function _checkProtocol() {
	            if (!Logline._protocol) {
	                util.throwError('you must choose a protocol with "using" method.');
	            }
	        }

	        // 发送日志

	    }, {
	        key: 'deploy',
	        value: function deploy(descriptor, tickerFn, readyFn, errorFn) {
	            Logline._checkProtocol();
	            if (Logline._reportTo) {
	                Logline._protocol.all(function (logs) {
	                    var xhr = new XMLHttpRequest(),
	                        logsToSend = [],
	                        log,
	                        key,
	                        line;

	                    xhr.upload.onprogress = tickerFn;
	                    xhr.onload = function () {
	                        if (200 === xhr.status) {
	                            'function' === typeof readyFn && readyFn();
	                        } else {
	                            'function' === typeof errorFn && errorFn();
	                        }
	                    };
	                    xhr.onerror = function () {
	                        'function' === typeof errorFn && errorFn();
	                    };
	                    xhr.open('POST', LogcatInterface._reportTo);
	                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	                    // 处理logs成常见的日志形式来上报(一行一条日志内容)，避免重复键名占用空间
	                    while (log = logs.pop()) {
	                        line = [];
	                        for (key in log) {
	                            if (log.hasOwnProperty(key) && log[key]) {
	                                line.push(log[key]);
	                            }
	                        }
	                        logsToSend.push(line.join('\t'));
	                    }

	                    xhr.withCredentials = true;
	                    logsToSend.unshift(location.host + (descriptor ? ': ' + descriptor : ''));
	                    xhr.send('data=' + (escape(logsToSend.join('\n')) || 'no data'));
	                });
	            } else {
	                util.throwError('report address is not configed.');
	            }
	        }

	        // 清理日志

	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            try {
	                Logline._checkProtocol();
	                Logline._protocol.keep(daysToMaintain);
	            } catch (e) {
	                util.throwError('unable to remove logs earlier than ' + daysToMaintain + 'd.');
	            }
	            return this;
	        }

	        // 清空日志并删除数据库

	    }, {
	        key: 'clean',
	        value: function clean() {
	            try {
	                Logline._checkProtocol();
	                Logline._protocol.clean();
	            } catch (e) {
	                util.throwError('unable to clean log database.');
	            }
	            return this;
	        }

	        // 选择一个日志协议

	    }, {
	        key: 'using',
	        value: function using(protocol) {
	            // 协议一旦选定即不允许在运行时更改
	            if (Logline._protocol) {
	                return this;
	            }

	            if (-1 < Object.values(Logline.PROTOCOL).indexOf(protocol)) {
	                Logline._protocol = protocol;
	                Logline.init();
	            } else {
	                util.throwError('specialfied protocol is not available.');
	            }

	            return this;
	        }

	        // 初始化选定的协议

	    }, {
	        key: 'init',
	        value: function init() {
	            Logline._checkProtocol();
	            Logline._protocol.init();

	            return this;
	        }

	        // 配置日志上报地址

	    }, {
	        key: 'reportTo',
	        value: function reportTo(_reportTo) {
	            Logline._reportTo = _reportTo;
	            return this;
	        }
	    }]);

	    return Logline;
	}();

	Logline._protocol = null;
	Logline._reportTo = null;

	Logline.PROTOCOL = {
	    WEBSQL: _websql2.default,
	    LOCALSTORAGE: _localstorage2.default,
	    INDEXEDDB: _indexeddb2.default
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

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var localStorageLogger = function (_LoggerInterface) {
	    _inherits(localStorageLogger, _LoggerInterface);

	    function localStorageLogger() {
	        var _ref;

	        _classCallCheck(this, localStorageLogger);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _possibleConstructorReturn(this, (_ref = localStorageLogger.__proto__ || Object.getPrototypeOf(localStorageLogger)).call.apply(_ref, [this].concat(args)));
	    }

	    _createClass(localStorageLogger, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            var logs = window.localStorage.getItem('logline') ? JSON.parse(window.localStorage.getItem('logline')) : [];
	            logs.push({
	                time: Date.now(),
	                namespace: this._namesapce,
	                level: level,
	                descriptor: descriptor,
	                data: data
	            });
	            try {
	                window.localStorage.setItem('logline', JSON.stringify(logs));
	            } catch (e) {
	                util.throwError('error inserting record');
	            }
	        }
	    }], [{
	        key: 'init',
	        value: function init() {
	            if (!('localStorage' in window)) {
	                util.throwError('your platform does not support localstorage protocol.');
	            }
	            if (!window.localStorage.getItem('logline')) {
	                window.localStorage.setItem('logline', JSON.stringify([]));
	            }
	        }
	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            readyFn(JSON.parse(window.localStorage.getItem('logline')));
	        }
	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            var logs = !daysToMaintain ? [] : (window.localStorage.getItem('logline') ? JSON.parse(window.localStorage.getItem('logline')) : []).filter(function (log) {
	                return log.time >= Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000;
	            });
	            window.localStorage.setItem('logline', JSON.stringify(logs));
	        }
	    }, {
	        key: 'clean',
	        value: function clean() {
	            window.localStorage.removeItem('logline');
	        }
	    }]);

	    return localStorageLogger;
	}(_interface2.default);

	exports.default = localStorageLogger;

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

	var Interface = function () {
	    function Interface(namespace) {
	        _classCallCheck(this, Interface);

	        this._namesapce = namespace;
	    }

	    // 添加一条日志记录


	    _createClass(Interface, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            util.throwError('method _record is not implemented.');
	        }

	        // 添加一条等级为info的日志记录

	    }, {
	        key: 'info',
	        value: function info() {
	            this._record.apply(this, Array.prototype.unshift.call(arguments, 'info') && arguments);
	        }

	        // 添加一条等级为warn的日志记录

	    }, {
	        key: 'warn',
	        value: function warn() {
	            this._record.apply(this, Array.prototype.unshift.call(arguments, 'warning') && arguments);
	        }

	        // 添加一条等级为error的日志记录

	    }, {
	        key: 'error',
	        value: function error() {
	            this._record.apply(this, Array.prototype.unshift.call(arguments, 'error') && arguments);
	        }

	        // 添加一条等级为critical的日志记录

	    }, {
	        key: 'critical',
	        value: function critical() {
	            this._record.apply(this, Array.prototype.unshift.call(arguments, 'critical') && arguments);
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
	function throwError(errMessage) {
	    throw new Error('Logline: ' + errMessage);
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WebsqlLogger = function (_LoggerInterface) {
	    _inherits(WebsqlLogger, _LoggerInterface);

	    function WebsqlLogger() {
	        var _ref;

	        _classCallCheck(this, WebsqlLogger);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _possibleConstructorReturn(this, (_ref = WebsqlLogger.__proto__ || Object.getPrototypeOf(WebsqlLogger)).call.apply(_ref, [this].concat(args)));
	    }

	    _createClass(WebsqlLogger, [{
	        key: '_record',
	        value: function _record(level, descriptor, data, triedTimes) {
	            var self = this,
	                args = arguments;

	            if (!triedTimes || triedTimes < 10) {
	                if (WebsqlLogger._inited) {
	                    try {
	                        WebsqlLogger._db.transaction(function (tx) {
	                            tx.executeSql('INSERT INTO logs (time, namespace, level, descriptor, data) VALUES(?, ?, ?, ? ,?)', [Date.now(), self._namesapce, level, descriptor, data === undefined || data === '' ? '' : JSON.stringify(data) || ''], function () {/* empty func */}, function (tx, e) {
	                                throw e;
	                            });
	                        });
	                    } catch (e) {
	                        util.throwError('error inserting record');
	                    }
	                } else {
	                    setTimeout(function () {
	                        switch (args.length) {
	                            case 2:
	                                Array.prototype.push.call(args, '', 1);
	                                break;
	                            case 3:
	                                Array.prototype.push.call(args, 1);
	                                break;
	                            case 4:
	                                Array.prototype.push.call(args = Array.prototype.slice.call(args, 0, 3), triedTimes + 1);
	                                break;
	                            default:
	                                break;
	                        }
	                        self._record.apply(self, args);
	                    });
	                }
	            }
	        }
	    }], [{
	        key: 'init',
	        value: function init() {
	            if (!('openDatabase' in window)) {
	                util.throwError(new Error('your platform does not support websql protocol.'));
	            }
	            try {
	                WebsqlLogger._db = window.openDatabase('logline', '1.0', 'cats loves logs', 4.85 * 1024 * 1024);
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)', [], function () {
	                        WebsqlLogger._inited = true;
	                    }, function () {
	                        WebsqlLogger._inited = false;
	                    });
	                });
	            } catch (e) {
	                util.throwError('unable to init log database.');
	            }
	        }
	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('SELECT * FROM logs', [], function (tx, res) {
	                        var logs = [],
	                            index = res.rows.length;
	                        while (--index >= 0) {
	                            logs.push(res.rows.item(index));
	                        }
	                        readyFn(logs);
	                    }, function (tx, e) {
	                        throw e;
	                    });
	                });
	            } catch (e) {
	                util.throwError('unable to collect logs from database.');
	            }
	        }
	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    if (daysToMaintain) {
	                        tx.executeSql('DELETE FROM logs WHERE time < ?', [Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000], function () {/* empty func */}, function (tx, e) {
	                            throw e;
	                        });
	                    } else {
	                        tx.executeSql('DELETE FROM logs', [], function () {/* empty func */}, function (tx, e) {
	                            throw e;
	                        });
	                    }
	                });
	            } catch (e) {
	                util.throwError('unable to clean logs from database.');
	            }
	        }
	    }, {
	        key: 'clean',
	        value: function clean() {
	            try {
	                WebsqlLogger._db.transaction(function (tx) {
	                    tx.executeSql('DROP TABLE logs', [], function () {/* empty func */}, function (tx, e) {
	                        throw e;
	                    });
	                });
	            } catch (e) {
	                util.throwError('unable to clean log database.');
	            }
	        }
	    }]);

	    return WebsqlLogger;
	}(_interface2.default);

	exports.default = WebsqlLogger;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	var _util = __webpack_require__(3);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IndexedDBLogger = function (_LoggerInterface) {
	    _inherits(IndexedDBLogger, _LoggerInterface);

	    function IndexedDBLogger() {
	        var _ref;

	        _classCallCheck(this, IndexedDBLogger);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _possibleConstructorReturn(this, (_ref = IndexedDBLogger.__proto__ || Object.getPrototypeOf(IndexedDBLogger)).call.apply(_ref, [this].concat(args)));
	    }

	    _createClass(IndexedDBLogger, [{
	        key: '_record',
	        value: function _record(level, descriptor, data) {
	            var transaction = IndexedDBLogger.db.transaction(['logs'], IDBTransaction.READ_WRITE || 'readwrite');
	            transaction.onerror = function (event) {
	                return util.throwError(event.target.errorCode);
	            };

	            var store = transaction.objectStore('logs');
	            var request = store.add({
	                timestamp: Date.now(),
	                namespace: this._namesapce,
	                descriptor: descriptor,
	                data: data
	            });

	            request.onerror = function (event) {
	                return util.throwError(event.target.errorCode);
	            };
	        }
	    }], [{
	        key: 'init',
	        value: function init() {
	            if (!window.indexedDB || !window.IDBTransaction || !window.IDBKeyRange) {
	                util.throwError('your platform does not support indexeddb protocol.');
	            }

	            IndexedDBLogger.request = window.indexedDB.open('logline');
	            IndexedDBLogger.request.onerror = function (event) {
	                return util.throwError('protocol indexeddb is prevented.');
	            };
	            IndexedDBLogger.request.onsuccess = function (event) {
	                IndexedDBLogger.db = event.target.result;
	                // globally handle db request errors
	                IndexedDBLogger.db.onerror = function (event) {
	                    return util.throwError(event.target.errorCode);
	                };
	            };
	            IndexedDBLogger.request.onupgradeneeded = function (event) {
	                // init dabasebase
	                var db = event.target.result,
	                    store = db.createObjectStore('logs', { keyPath: 'timestamp' });
	                store.createIndex('namespace', 'namespace', { unique: false });
	                store.createIndex('level', 'level', { unique: false });
	                store.createIndex('descriptor', 'descriptor', { unique: false });
	                store.createIndex('data', 'data', { unique: false });
	            };
	        }
	    }, {
	        key: 'all',
	        value: function all(readyFn) {
	            var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY || 'readonly'),
	                request = store.openCursor(),
	                logs = [];

	            request.onsuccess = function (event) {
	                var cursor = event.target.result;
	                if (cursor) {
	                    logs.push({
	                        timestamp: cursor.value.timestamp,
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
	    }, {
	        key: 'keep',
	        value: function keep(daysToMaintain) {
	            var store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_WRITE);
	            if (!daysToMaintain) {
	                var request = store.clear().onerror = function (event) {
	                    return util.throwError(event.target.errorCode);
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
	    }, {
	        key: 'clean',
	        value: function clean() {
	            // database can be removed only after all connections are closed
	            IndexedDBLogger.db.close();
	            var request = window.indexedDB.deleteDatabase('logline');
	            request.onerror = function (event) {
	                return util.throwError(event.target.errorCode);
	            };
	            /* eslint no-unused-vars: "off" */
	            request.onsuccess = function (event) {
	                return delete IndexedDBLogger.db;
	            };
	        }
	    }, {
	        key: '_getTransactionStore',
	        value: function _getTransactionStore(mode) {
	            if (IndexedDBLogger.db) {
	                var transaction = IndexedDBLogger.db.transaction(['logs'], mode || IDBTransaction.READ_WRITE || 'readwrite');
	                transaction.onerror = function (event) {
	                    return util.throwError(event.target.errorCode);
	                };
	                return transaction.objectStore('logs');
	            } else {
	                util.throwError('log database is not created or connections is closed, considering init it.');
	            }
	        }
	    }]);

	    return IndexedDBLogger;
	}(_interface2.default);

	exports.default = IndexedDBLogger;

/***/ }
/******/ ])
});
;