import LoggerInterface from './interface';
import Pool from '../lib/pool';
import * as util from '../lib/util';

/**
 * indexedDB日志协议
 * @class IndexedDBLogger
 */
export default class IndexedDBLogger extends LoggerInterface {
    /**
     * 构造函数
     * @constructor
     * @param {String} namespace - 日志的命名空间
     */
    constructor(...args) {
        super(...args);
    }

    /**
     * 添加一条日志记录
     * @method _reocrd
     * @private
     * @parma {String} level - 日志等级
     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
     * @param {Mixed} data - 要记录的附加数据
     */
    _record(level, descriptor, data) {
        if (IndexedDBLogger.status !== LoggerInterface.STATUS.INITED) {
            IndexedDBLogger._pool.push(() => {
                this._record(level, descriptor, data);
            });
            if (IndexedDBLogger.status !== LoggerInterface.STATUS.INITING) {
                IndexedDBLogger.init();
            }
            return;
        }

        let transaction = IndexedDBLogger.db.transaction(['logs'], IDBTransaction.READ_WRITE || 'readwrite');
        transaction.onerror = event => util.throwError(event.target.error);

        let store = transaction.objectStore('logs');
        let request = store.add({
            time: Date.now(),
            namespace: this._namesapce,
            descriptor: descriptor,
            data: data
        });

        request.onerror = event => {
            IndexedDBLogger.status = LoggerInterface.STATUS.FAILED;
            util.throwError(event.target.error);
        };
    }

    /**
     * 初始化协议
     * @method init
     * @static
     * @param {String} database - 初始化时要使用的数据库名
     */
    static init(database) {
        if (!IndexedDBLogger.support) {
            util.throwError('your platform does not support indexeddb protocol.');
        }

        if (IndexedDBLogger.status) {
            return false;
        }

        IndexedDBLogger._pool = IndexedDBLogger._pool || new Pool();
        IndexedDBLogger._database = database || 'logline';
        IndexedDBLogger.status = super.STATUS.INITING;

        IndexedDBLogger.request = window.indexedDB.open(IndexedDBLogger._database);
        IndexedDBLogger.request.onerror = event => util.throwError('protocol indexeddb is prevented.');
        IndexedDBLogger.request.onsuccess = event => {
            IndexedDBLogger.db = event.target.result;
            IndexedDBLogger.status = super.STATUS.INITED;
            IndexedDBLogger._pool.consume();
            // globally handle db request errors
            IndexedDBLogger.db.onerror = event => util.throwError(event.target.error);
        };
        IndexedDBLogger.request.onupgradeneeded = event => {
            // init dabasebase
            let db = event.target.result, store = db.createObjectStore('logs', { autoIncrement: true });
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
    static all(readyFn) {
        if (IndexedDBLogger.status !== super.STATUS.INITED) {
            IndexedDBLogger._pool.push(() => {
                IndexedDBLogger.all(readyFn);
            });
            return;
        }

        let store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY || 'readonly'),
            request = store.openCursor(),
            logs = [];

        request.onsuccess = event => {
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
            }
            else {
                readyFn(logs);
            }
        };

        request.onerror = event => util.throwError('failed to literat on logs from database.');
    }

    /**
     * 清理日志
     * @method keep
     * @static
     * @param {Number} daysToMaintain - 保留多少天数的日志
     */
    static keep(daysToMaintain) {
        if (IndexedDBLogger.status !== super.STATUS.INITED) {
            IndexedDBLogger._pool.push(() => {
                IndexedDBLogger.keep(daysToMaintain);
            });
            return;
        }

        let store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_WRITE);
        if (!daysToMaintain) {
            let request = store.clear().onerror = event => util.throwError(event.target.error);
        }
        else {
            let range = IDBKeyRange.upperBound((Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000), true);
            let request = store.openCursor(range);
            request.onsuccess = event => {
                let cursor = event.target.result;
                if (cursor) {
                    store.delete(cursor.primaryKey);
                    cursor.continue();
                }
            };
            request.onerror = event => util.throwError('unable to locate logs earlier than ' + daysToMaintain + 'd.');
        }
    }

    /**
     * 删除日志数据库
     * @method clean
     * @static
     */
    static clean() {
        if (IndexedDBLogger.status !== super.STATUS.INITED) {
            IndexedDBLogger._pool.push(() => {
                IndexedDBLogger.clean();
            });
            return;
        }

        // database can be removed only after all connections are closed
        IndexedDBLogger.db.close();
        let request = window.indexedDB.deleteDatabase(IndexedDBLogger._database);
        request.onerror = event => util.throwError(event.target.error);
        /* eslint no-unused-vars: "off" */
        request.onsuccess = event => {
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
    static _getTransactionStore(mode) {
        if (IndexedDBLogger.db) {
            let transaction = IndexedDBLogger.db.transaction(['logs'], mode || IDBTransaction.READ_WRITE || 'readwrite');
            transaction.onerror = event => util.throwError(event.target.error);
            return transaction.objectStore('logs');
        }
        else {
            util.throwError('log database is not created or connections is closed, considering init it.');
        }
    }

    /**
     * 是否支持indexedDB
     * @prop {Boolean} support
     */
    static get support() {
        return !!(window.indexedDB && window.IDBTransaction && window.IDBKeyRange);
    }
}
