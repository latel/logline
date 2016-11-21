import LoggerInterface from './interface';
import * as util from './lib/util';

export default class IndexedDBLogger extends LoggerInterface {
    constructor(...args) {
        super(...args);
    }

    _record(level, descriptor, data) {
        let transaction = IndexedDBLogger.db.transaction(['logs'], IDBTransaction.READ_WRITE || 'readwrite');
        transaction.onerror = event => util.throwError(event.target.errorCode);

        let store = transaction.objectStore('logs');
        let request = store.add({
            timestamp: Date.now(),
            namespace: this._namesapce,
            descriptor: descriptor,
            data: data
        });

        request.onerror = event => util.throwError(event.target.errorCode);
    }

    static init() {
        if (!window.indexedDB || !window.IDBTransaction || !window.IDBKeyRange) {
            util.throwError('your platform does not support indexeddb protocol.');
        }

        IndexedDBLogger.request = window.indexedDB.open('logline');
        IndexedDBLogger.request.onerror = event => util.throwError('protocol indexeddb is prevented.');
        IndexedDBLogger.request.onsuccess = event => {
            IndexedDBLogger.db = event.target.result;
            // globally handle db request errors
            IndexedDBLogger.db.onerror = event => util.throwError(event.target.errorCode);
        };
        IndexedDBLogger.request.onupgradeneeded = event => {
            // init dabasebase
            let db = event.target.result, store = db.createObjectStore('logs', { keyPath: 'timestamp' });
            store.createIndex('namespace', 'namespace', { unique: false });
            store.createIndex('level', 'level', { unique: false });
            store.createIndex('descriptor', 'descriptor', { unique: false });
            store.createIndex('data', 'data', { unique: false });
        };
    }

    static all(readyFn) {
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
        // database can be removed only after all connections are closed
        IndexedDBLogger.db.close();
        let request = window.indexedDB.deleteDatabase('logline');
        request.onerror = event => util.throwError(event.target.errorCode);
        /* eslint no-unused-vars: "off" */
        request.onsuccess = event => delete IndexedDBLogger.db;
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
