import LoggerInterface from './interface';
import * as util from '../lib/util';

export default class LocalStorageLogger extends LoggerInterface {
    constructor(...args) {
        super(...args);
    }

    _record(level, descriptor, data) {
        var logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
        logs.push({
            time: Date.now(),
            namespace: this._namesapce,
            level: level,
            descriptor: descriptor,
            data: data
        });
        try {
            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
        } catch (e) { util.throwError('error inserting record'); }
    }

    static init(database) {
        if (!LocalStorageLogger.support) {
            util.throwError('your platform does not support localstorage protocol.');
        }
        LocalStorageLogger._database = database || 'logline';
        if (!window.localStorage.getItem(LocalStorageLogger._database)) {
            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify([]));
        }
        LocalStorageLogger.status = super.STATUS.INITED;
    }

    static all(readyFn) {
        readyFn(JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)));
    }

    static keep(daysToMaintain) {
        var logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(log => {
            return log.time >= (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
        });
        window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
    }

    static clean() {
        delete LocalStorageLogger.status;
        window.localStorage.removeItem(LocalStorageLogger._database);
    }
}

LoggerInterface.support = 'localStorage' in window;
