(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.logline = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var ConsoleLevel;
    (function (ConsoleLevel) {
        ConsoleLevel["LOG"] = "log";
        ConsoleLevel["INFO"] = "info";
        ConsoleLevel["WARN"] = "warn";
        ConsoleLevel["ERROR"] = "error";
    })(ConsoleLevel || (ConsoleLevel = {}));
    var _console = typeof window !== 'undefined' && window.console || false;
    var console = function (level) {
        var content = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            content[_i - 1] = arguments[_i];
        }
        var _a;
        if (_console) {
            (_a = _console)[level].apply(_a, content);
        }
    };
    var timeDescriptorTranslate = function (descriptor) {
        // if falsy value or timestamp already, pass it through directly,
        if (!descriptor || /^\d{13}$/.test(String(descriptor))) {
            return +descriptor;
        }
        return Date.now() - +String(descriptor).replace(/d$/, '') * 24 * 3600 * 1000;
    };

    var storageList = [];
    var activeStorage;
    /**
     * install a new storage implements
     * @param storage storage definition
     * @param priority storage priority
     */
    var install = function (storage, priority) {
        storage.__priority = priority;
        storageList.push(storage);
        // index storagies by priority
        storageList.sort(function (a, b) { return b.__priority - a.__priority; });
    };
    var BaseStorage = /** @class */ (function () {
        function BaseStorage(module) {
            this.module = module;
        }
        BaseStorage.prototype.debug = function (message, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.record(LogLevel.DEBUG, message, data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BaseStorage.prototype.info = function (message, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.record(LogLevel.INFO, message, data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BaseStorage.prototype.warn = function (message, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.record(LogLevel.WARN, message, data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BaseStorage.prototype.error = function (message, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.record(LogLevel.ERROR, message, data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BaseStorage.prototype.critical = function (message, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.record(LogLevel.CRITICAL, message, data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return BaseStorage;
    }());
    var MemStorage = /** @class */ (function (_super) {
        __extends(MemStorage, _super);
        function MemStorage(module) {
            var _this = _super.call(this, module) || this;
            _this.module = module;
            return _this;
        }
        MemStorage.drop = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); });
        };
        MemStorage.support = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); });
        };
        MemStorage.query = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, []];
            }); });
        };
        MemStorage.delete = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, 0];
            }); });
        };
        MemStorage.init = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); });
        };
        MemStorage.destroy = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); });
        };
        MemStorage.prototype.record = function (level, message, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, true];
                });
            });
        };
        MemStorage.database = [];
        return MemStorage;
    }(BaseStorage));
    var getActiveStorage = function () {
        return activeStorage;
    };
    // @ts-ignore
    install(MemStorage, 0);

    var _this = undefined;
    /**
     * query all logs
     */
    var all = function () { return __awaiter(_this, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.query()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, []];
            }
        });
    }); };
    function get() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var storage, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storage = getActiveStorage();
                        _a = args.length;
                        switch (_a) {
                            case 2: return [3 /*break*/, 1];
                            case 1: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, storage.query({
                            from: timeDescriptorTranslate(args[0]),
                            to: timeDescriptorTranslate(args[1])
                        }).then(function (logItemSet) { return args[2](logItemSet); })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, []];
                    case 3: return [4 /*yield*/, storage.query({
                            from: timeDescriptorTranslate(args[0]),
                            to: Date.now()
                        }).then(function (logItemSet) { return args[1](logItemSet); })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/, []];
                }
            });
        });
    }
    var before = function (to) { return __awaiter(_this, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.query({
                            to: timeDescriptorTranslate(to),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, []];
            }
        });
    }); };
    var after = function (from) { return __awaiter(_this, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.query({
                            from: timeDescriptorTranslate(from),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, []];
            }
        });
    }); };
    var between = function (from, to) { return __awaiter(_this, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.query({
                            from: timeDescriptorTranslate(from),
                            to: timeDescriptorTranslate(to),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, []];
            }
        });
    }); };
    var filter = function (search) { return __awaiter(_this, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.query(search)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, []];
            }
        });
    }); };

    var query = /*#__PURE__*/Object.freeze({
        all: all,
        get: get,
        before: before,
        after: after,
        between: between,
        filter: filter
    });

    var _this$1 = undefined;
    /**
     * keep logs within a cetain timepoint, other logs will be removed
     * @deprecated 1.2.0
     * @param from specify a time poinit after which log will be kept, otherwise removed
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var keep = function (from) { return __awaiter(_this$1, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, 0];
        });
    }); };
    /**
     * remove all logs
     * @alias all
     * @deprecated 1.2.0
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var clean = function () { return __awaiter(_this$1, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, all$1()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    /**
     * remove all logs
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var all$1 = function () { return __awaiter(_this$1, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.delete()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 0];
            }
        });
    }); };
    /**
     * remove logs before a certain timepoint
     * @param to target log end with which time
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var before$1 = function (to) { return __awaiter(_this$1, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.delete({
                            to: timeDescriptorTranslate(to),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 0];
            }
        });
    }); };
    /**
     * remove logs from a certain timepoint
     * @param from target log from which time
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var after$1 = function (from) { return __awaiter(_this$1, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.delete({
                            from: timeDescriptorTranslate(from),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 0];
            }
        });
    }); };
    /**
     * delete logs within a certain time range
     * @param from target log from which time
     * @param to target log end with which time
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var between$1 = function (from, to) { return __awaiter(_this$1, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.delete({
                            from: timeDescriptorTranslate(from),
                            to: timeDescriptorTranslate(to),
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 0];
            }
        });
    }); };
    /**
     * remove log database
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var drop = function () { return __awaiter(_this$1, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.drop()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 0];
            }
        });
    }); };
    /**
     * removed logs that satisfies given search pattern
     * @param search search pattern
     * @returns numbers of logs deleted, -1 indicates that an error has occured
     */
    var filter$1 = function (search) { return __awaiter(_this$1, void 0, void 0, function () {
        var storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storage = getActiveStorage();
                    return [4 /*yield*/, storage.delete(search)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 0];
            }
        });
    }); };

    var _delete = /*#__PURE__*/Object.freeze({
        keep: keep,
        clean: clean,
        all: all$1,
        before: before$1,
        after: after$1,
        between: between$1,
        drop: drop,
        filter: filter$1
    });

    var eventsMaps = {};
    /**
     * get handlers for the current event
     * @param event event name
     */
    var getEventMap = function (event) {
        return eventsMaps[event] = eventsMaps[event] || [];
    };
    /**
     * listen to a event
     * @param event event name to listen
     * @param handler event handler
     * @param once if event handler should only emit one time
     */
    var on = function (event, handler, once) {
        if (once === void 0) { once = false; }
        var map = getEventMap(event);
        handler.__once = once;
        map.push(handler);
    };
    /**
     * stop listen to a event
     * @param event event name to stop listen to
     * @param handler event handler already registered, if not provieded, will remove all handlers under this event
     */
    var off = function (event, handler) {
        var map = getEventMap(event);
        if (!handler) {
            map = [];
            return;
        }
        else {
            map = map.filter(function (fn) { return handler !== fn; });
        }
    };

    var install$1 = function (plugin) {
    };

    var name = "logline";

    var DEFAULT_CONFIG = {
        logLevel: LogLevel.DEBUG,
        logModule: ['*'],
        database: name,
    };
    var config = Object.create(DEFAULT_CONFIG);
    var update = function (setting) {
        config = __assign({}, config, setting);
    };

    // config logline
    var config$1 = function (setting) { return update(setting); };
    // export deprecated query API, will be removed in the next major release
    /**
     * query all logs
     * @deprecated 1.2.0
     * @param cb callback with logs retrived
     */
    var all$2 = function (cb) {
        console(ConsoleLevel.WARN, 'all() is deprecated since v1.2.0, please use .q instead');
        all().then(function (logItemSet) { return cb(logItemSet); });
    };
    /**
     * query logs within a certain time range
     * @param from target log from which time
     * @param to target log end with which time
     * @param cb callback with logs retrived
     */
    var get$2 = function (from, to, cb) {
        console(ConsoleLevel.WARN, 'get() is deprecated since v1.2.0, please use .q instead');
        get(from, to).then(function (logItemSet) { return cb(logItemSet); });
    };
    // export deprecated delete API, will be removed in the next major release
    /**
     * keep logs within certain period
     * @param from specify a time poinit after which log will be kept, otherwise removed
     * @param cb callback when other logs are removed
     */
    var keep$1 = function (from, cb) {
        console(ConsoleLevel.WARN, 'keep() is deprecated since v1.2.0, please use .d instead');
        after$1(from).then(function (deletedLogsCount) { return cb(deletedLogsCount); });
    };
    /**
     * remove all logs and delete log database
     * @param cb callback when log database is cleaned
     */
    var clean$1 = function (cb) {
        console(ConsoleLevel.WARN, 'clean() is deprecated since v1.2.0, please use .d instead');
        clean().then(function (deletedLogsCount) { return cb(deletedLogsCount); });
    };
    // export local type definitions

    exports.config = config$1;
    exports.q = query;
    exports.d = _delete;
    exports.all = all$2;
    exports.get = get$2;
    exports.keep = keep$1;
    exports.clean = clean$1;
    exports.on = on;
    exports.off = off;
    exports.plugin = install$1;
    exports.storage = install;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
