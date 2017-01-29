import LoggerInterface from './interface';
import Pool from '../lib/pool';
import * as util from '../lib/util';

/**
 * Websql protocol
 * @class WebsqlLogger
 */
export default class WebsqlLogger extends LoggerInterface {
    /**
     * Websql logline constructor
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
        if (WebsqlLogger.status !== LoggerInterface.STATUS.INITED) {
            WebsqlLogger._pool.push(() => {
                this._record(level, descriptor, data);
            });
            if (WebsqlLogger.status !== LoggerInterface.STATUS.INITING) {
                WebsqlLogger.init();
            }
            return;
        }

        try {
            WebsqlLogger._db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO logs (time, namespace, level, descriptor, data) VALUES(?, ?, ?, ? ,?)',
                    [Date.now(), this._namesapce, level, descriptor, (data === undefined || data === '') ? '' : (JSON.stringify(data) || '')],
                    () => {/* empty func */},
                    (tx, e) => { throw e.message; }
                );
            });
        } catch (e) { util.throwError('error inserting record'); }
    }

    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    static init(database) {
        if (!WebsqlLogger.support) {
            util.throwError(new Error('your platform does not support websql protocol.'));
        }

        if (WebsqlLogger.status) {
            return false;
        }

        WebsqlLogger._pool = WebsqlLogger._pool || new Pool();
        WebsqlLogger._database = database || 'logline';
        WebsqlLogger.status = super.STATUS.INITING;

        try {
            WebsqlLogger._db = window.openDatabase(WebsqlLogger._database, '1.0', 'cats loves logs', 4.85 * 1024 * 1024);
            WebsqlLogger._db.transaction(tx => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)', [],
                    () => {
                        WebsqlLogger.status = super.STATUS.INITED;
                        WebsqlLogger._pool.consume();
                    },
                    () => {
                        WebsqlLogger.status = super.STATUS.FAILED;
                    }
                );
            });
        } catch (e) { util.throwError('unable to init log database.'); }
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
        if (WebsqlLogger.status !== super.STATUS.INITED) {
            WebsqlLogger._pool.push(() => {
                WebsqlLogger.get(from, to, readyFn);
            });
            return;
        }

        from = LoggerInterface.transTimeFormat(from);
        to = LoggerInterface.transTimeFormat(to);

        try {
            WebsqlLogger._db.transaction(function(tx) {
                tx.executeSql(
                    'SELECT * FROM logs ORDER BY time DESC', [],
                    (tx, res) => {
                        var logs = [], line, index = res.rows.length, item;
                        while (--index >= 0) {
                            item = res.rows.item(index);
                            if ((from && item.time < from) || (to && item.time > to)) {
                                continue;
                            }

                            // in some devices, properties are configureable: false, writable: false
                            // we need deep copy
                            line = JSON.parse(JSON.stringify(item));
                            // incase data is an object, not a string
                            try { line.data = JSON.parse(line.data); }
                            catch (e) {/* leave line.data as it be */}
                            logs.push(line);
                        }
                        readyFn(logs);
                    },
                    (tx, e) => { throw e.message; }
                );
            });
        } catch (e) { util.throwError('unable to collect logs from database.'); }
    }

    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    static keep(daysToMaintain) {
        if (WebsqlLogger.status !== super.STATUS.INITED) {
            WebsqlLogger._pool.push(() => {
                WebsqlLogger.keep(daysToMaintain);
            });
            return;
        }

        try {
            WebsqlLogger._db.transaction(function(tx) {
                if (daysToMaintain) {
                    tx.executeSql(
                        'DELETE FROM logs WHERE time < ?',
                        [Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000],
                        function() {/* empty func */},
                        function(tx, e) {throw e.message;}
                    );
                }
                else {
                    tx.executeSql(
                        'DELETE FROM logs', [],
                        () => {/* empty func */},
                        (tx, e) => { throw e.message; }
                    );
                }
            });
        } catch (e) { util.throwError('unable to clean logs from database.'); }
    }

    /**
     * delete log database
     * @method clean
     * @static
     */
    static clean() {
        if (WebsqlLogger.status !== super.STATUS.INITED) {
            WebsqlLogger._pool.push(() => {
                WebsqlLogger.clean();
            });
            return;
        }

        try {
            WebsqlLogger._db.transaction(tx => {
                tx.executeSql(
                    'DROP TABLE logs', [],
                    () => {
                        delete WebsqlLogger.status;
                    },
                    (tx, e) => { throw e.message; }
                );
            });
        } catch (e) { util.throwError('unable to clean log database.'); }
    }

    /**
     * detect support situation
     * @prop {Boolean} support
     */
    static get support() {
        return 'openDatabase' in window;
    }
}
