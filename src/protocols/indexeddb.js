import LoggerInterface from './interface';
import Pool from '../lib/pool';
import * as util from '../lib/util';

/**
 * IndexedDB protocol
 * @class IndexedDBLogger
 */
export default class IndexedDBLogger extends LoggerInterface {
    /**
     * IndexedDB protocol constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    constructor(...args) {
        super(...args);
    }

    /**
     * add a log record
     * @method _reocrd
     * @private
     * @parma {String} level - log level
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
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
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
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
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} from - time from, unix time stamp or falsy
     * @param {String} to - time end, unix time stamp or falsy
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    static get(from, to, readyFn) {
        if (IndexedDBLogger.status !== super.STATUS.INITED) {
            IndexedDBLogger._pool.push(() => {
                IndexedDBLogger.get(from, to, readyFn);
            });
            return;
        }

        from = LoggerInterface.transTimeFormat(from);
        to = LoggerInterface.transTimeFormat(to);

        let store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY || 'readonly'),
            request = store.openCursor(),
            logs = [];

        request.onsuccess = event => {
            var cursor = event.target.result;
            if (cursor) {
                if ((from && cursor.value.time < from) || (to && cursor.value.time > to)) {
                    cursor.continue();
                }

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
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
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
     * delete log database
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
     * get internal transaction store
     * @method _getTransactionStore
     * @private
     * @static
     * @param {String} mode - transaction mode
     * @return {Object} - internal object store
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
     * detect support situation
     * @prop {Boolean} support
     */
    static get support() {
        return !!(window.indexedDB && window.IDBTransaction && window.IDBKeyRange);
    }
}
