import LoggerInterface from './interface';
import Pool from '../lib/pool';
import * as util from '../lib/util';

const READ_WRITE = 'readwrite';

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
     * @param {Boolean} [develop] - to tell develop environment from production
     */
    _record(level, descriptor, data, develop) {
        try {
            if (IndexedDBLogger.status !== LoggerInterface.STATUS.INITED) {
                IndexedDBLogger._pool.push(() => this._record(level, descriptor, data, develop));
                if (IndexedDBLogger.status !== LoggerInterface.STATUS.INITING) {
                    IndexedDBLogger.init();
                }
                return;
            }
            if (develop) {
                util.debug(this._namespace, level, descriptor, data);
            }
            let transaction = IndexedDBLogger.db.transaction(['logs'], READ_WRITE || 'readwrite');
            transaction.onerror = event => util.throwError(event.target.error);

            let store = transaction.objectStore('logs');
            // should not contains any function in data
            // otherwise 'DOMException: Failed to execute 'add' on 'IDBObjectStore': An object could not be cloned.' will be thrown
            let request = store.add({
                time: Date.now(),
                level: level,
                namespace: this._namespace,
                descriptor: descriptor,
                data: util.filterFunction(data)
            });

            request.onerror = event => {
                IndexedDBLogger.status = LoggerInterface.STATUS.FAILED;
                util.throwError(event.target.error);
            };
        } catch (e) {
            util.throwError('failed to write, ' + e.message);
        }
    }

    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    static init(database) {
        try {
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
        } catch (e) {
            util.throwError('failed init, ' + e.message);
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
    static get(from, to, readyFn) {
        try {
            if (IndexedDBLogger.status !== super.STATUS.INITED) {
                return IndexedDBLogger._pool.push(() => IndexedDBLogger.get(from, to, readyFn));
            }

            from = LoggerInterface.transTimeFormat(from);
            to = LoggerInterface.transTimeFormat(to);

            let store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_ONLY);
            if (!store) {
                return readyFn([]);
            }

            // IDBObjectStore.getAll is a non-standard API
            if (store.getAll) {
                let result, logs = [];
                store.getAll().onsuccess = event => {
                    result = event.target.result;
                    for (let i = 0; i < result.length; i++) {
                        if ((from && result[i].time < from) || (to && result[i].time > to)) {
                            continue;
                        }
                        logs.push(result[i]);
                    }
                    readyFn(logs);
                };
            } else {
                let request = store.openCursor(), logs = [];
                request.onsuccess = event => {
                    var cursor = event.target.result;
                    if (cursor) {
                        if ((from && cursor.value.time < from) || (to && cursor.value.time > to)) {
                            return cursor.continue();
                        }

                        logs.push({
                            time: cursor.value.time,
                            level: cursor.value.level,
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
            }
        } catch (e) {
            util.throwError('failed to get logs, ' + e.message);
        }
    }

    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    static keep(daysToMaintain) {
        try {
            if (IndexedDBLogger.status !== super.STATUS.INITED) {
                return IndexedDBLogger._pool.push(() => IndexedDBLogger.keep(daysToMaintain));
            }

            let store = IndexedDBLogger._getTransactionStore(READ_WRITE);
            if (!store) {
                return false;
            }
            if (!daysToMaintain) {
                let request = store.clear().onerror = event => util.throwError(event.target.error);
            }
            else {
                let range = (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
                let request = store.openCursor();
                request.onsuccess = event => {
                    let cursor = event.target.result;
                    if (cursor && cursor.value.time < range) {
                        store.delete(cursor.primaryKey);
                        cursor.continue();
                    }
                };
                request.onerror = event => util.throwError('unable to locate logs earlier than ' + daysToMaintain + 'd.');
            }
        } catch (e) {
            util.throwError('failed to keep logs, ' + e.message);
        }
    }

    /**
     * delete log database
     * @method clean
     * @static
     */
    static clean() {
        try {
            if (IndexedDBLogger.status !== super.STATUS.INITED) {
                return IndexedDBLogger._pool.push(() => IndexedDBLogger.clean());
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
        } catch (e) {
            util.throwError('failed to cleanup logs, ' + e.message);
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
    static _getTransactionStore(mode) {
        try {
            if (IndexedDBLogger.db) {
                let transaction = IndexedDBLogger.db.transaction(['logs'], mode || READ_WRITE);
                transaction.onerror = event => util.throwError(event.target.error);
                return transaction.objectStore('logs');
            }
            else {
                util.throwError('log database is not created or connections are closed, considering init it.');
            }
        } catch (e) {
            util.throwError('failed to generate new transaction, ' + e.message);
            return false;
        }
    }

    /**
     * detect support situation
     * @prop {Boolean} support
     */
    static get support() {
        const support = !!(window.indexedDB && window.IDBTransaction && window.IDBKeyRange);
        return support;
    }
}
