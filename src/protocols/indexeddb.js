import LoggerInterface from './interface';
import Pool from '../lib/pool';
import * as util from '../lib/util';

export default class IndexedDBLogger extends LoggerInterface {
    constructor(...args) {
        super(...args);
    }

    _record(level, descriptor, data) {
        if (IndexedDBLogger.status === LoggerInterface.STATUS.INITING) {
            IndexedDBLogger._pool.push(() => {
                this._record(level, descriptor, data);
            });
            return;
        }

        let transaction = IndexedDBLogger.db.transaction(['logs'], IDBTransaction.READ_WRITE || 'readwrite');
        transaction.onerror = event => util.throwError(event.target.errorCode);

        let store = transaction.objectStore('logs');
        let request = store.add({
            timestamp: Date.now(),
            namespace: this._namesapce,
            descriptor: descriptor,
            data: data
        });

        request.onerror = event => {
            IndexedDBLogger.status = super.STATUS.FAILED;
            util.throwError(event.target.errorCode)
        };
    }

    static init(database) {
        if (!IndexedDBLogger.support) {
            util.throwError('your platform does not support indexeddb protocol.');
        }

        IndexedDBLogger._pool = new Pool();
        IndexedDBLogger._database = database || 'logline';
        IndexedDBLogger.status = super.STATUS.INITING;

        IndexedDBLogger.request = window.indexedDB.open(database);
        IndexedDBLogger.request.onerror = event => util.throwError('protocol indexeddb is prevented.');
        IndexedDBLogger.request.onsuccess = event => {
            IndexedDBLogger.db = event.target.result;
            IndexedDBLogger.status = super.STATUS.INITED;
            IndexedDBLogger._pool.consume();
            // globally handle db request errors
            IndexedDBLogger.db.onerror = event => util.throwError(event.target.errorCode);
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

    static all(readyFn) {
        if (IndexedDBLogger.status === super.STATUS.INITING) {
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
            if (cursor) {
                logs.push({
                    timestamp: cursor.value.timestamp,
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

    static keep(daysToMaintain) {
        if (IndexedDBLogger.status === super.STATUS.INITING) {
            IndexedDBLogger._pool.push(() => {
                IndexedDBLogger.keep(daysToMaintain);
            });
            return;
        }

        let store = IndexedDBLogger._getTransactionStore(IDBTransaction.READ_WRITE);
        if (!daysToMaintain) {
            let request = store.clear().onerror = event => util.throwError(event.target.errorCode);
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

    static clean() {
        if (IndexedDBLogger.status === super.STATUS.INITING) {
            IndexedDBLogger._pool.push(() => {
                IndexedDBLogger.clean();
            });
            return;
        }

        // database can be removed only after all connections are closed
        IndexedDBLogger.db.close();
        let request = window.indexedDB.deleteDatabase(IndexedDBLogger._database);
        request.onerror = event => util.throwError(event.target.errorCode);
        /* eslint no-unused-vars: "off" */
        request.onsuccess = event => {
            delete IndexedDBLogger.status;
            delete IndexedDBLogger.db;
        };
    }

    static _getTransactionStore(mode) {
        if (IndexedDBLogger.db) {
            let transaction = IndexedDBLogger.db.transaction(['logs'], mode || IDBTransaction.READ_WRITE || 'readwrite');
            transaction.onerror = event => util.throwError(event.target.errorCode);
            return transaction.objectStore('logs');
        }
        else {
            util.throwError('log database is not created or connections is closed, considering init it.');
        }
    }
}

IndexedDBLogger.support = !!(window.indexedDB && window.IDBTransaction && window.IDBKeyRange);
