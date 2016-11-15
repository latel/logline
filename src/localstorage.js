import Interface from './interface';
import * as util from './lib/util';

export default class localStorageLogger extends Interface {
    constructor(...args) {
        super(...args);
    }

    _record(level, descriptor, data) {
        var logs = window.localStorage.getItem('logcat') ? JSON.parse(window.localStorage.getItem('logcat')) : [];
        logs.push({
            time: Date.now(),
            namespace: this._namesapce,
            level: level,
            descriptor: descriptor,
            data: data
        });
        try {
            window.localStorage.setItem('logcat', JSON.stringify(logs));
        } catch (e) { util.displayError('error inserting record'); }
    }

    static init() {
        if (!window.localStorage.getItem('logcat')) {
            window.localStorage.setItem('logcat', JSON.stringify([]));
        }
    }

    static all(readyFn) {
        readyFn(JSON.parse(window.localStorage.getItem('logcat')));
    }

    static keep(daysToMaintain) {
        var logs = !daysToMaintain ? [] : (window.localStorage.getItem('logcat') ? JSON.parse(window.localStorage.getItem('logcat')) : []).filter(function(log) {
            return log.time >= (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
        });
        window.localStorage.setItem('logcat', JSON.stringify(logs));
    }

    static drop() {
        window.localStorage.removeItem('logcat');
    }

}
