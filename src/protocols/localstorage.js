import LoggerInterface from './interface';
import * as util from '../lib/util';

/**
 * Localstorage protocol
 * @class LocalStorageLogger
 */
export default class LocalStorageLogger extends LoggerInterface {
    /**
     * Localstorage protocol constructor
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
        var logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
        logs.push([
            Date.now(),
            this._namespace,
            level,
            descriptor,
            data
        ]);
        try {
            util.debug(this._namespace, level, descriptor, data);
            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
        } catch (e) { util.throwError('error inserting record'); }
    }

    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
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
        var logs = JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)), i;

        from = LoggerInterface.transTimeFormat(from);
        to = LoggerInterface.transTimeFormat(to);

        for (i = 0; i < logs.length; i++) {
            if ((from && logs[i][0] < from) || (to && logs[i][0] > to)) {
                continue;
            }

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
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    static keep(daysToMaintain) {
        var logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(log => {
            return log.time >= (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
        });
        window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
    }

    /**
     * delete log database
     * @method clean
     * @static
     */
    static clean() {
        delete LocalStorageLogger.status;
        window.localStorage.removeItem(LocalStorageLogger._database);
    }

    /**
     * detect support situation
     * @prop {Boolean} support
     */
    static get support() {
        return 'localStorage' in window;
    }
}
