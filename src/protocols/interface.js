import * as util from '../lib/util';

/**
 * Logline Interface
 * @class Interface
 */
export default class Interface {
    /**
     * Logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     */
    constructor(namespace) {
        this._namespace = namespace;
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
        util.throwError('method _record is not implemented.');
    }

    /**
     * add a level-info record
     * @method info
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    info(...args) {
        this._record('info', ...args);
    }

    /**
     * add a level-warn record
     * @method warn
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    warn(...args) {
        this._record('warn', ...args);
    }

    /**
     * add a level-error record
     * @method error
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    error(...args) {
        this._record('error', ...args);
    }

    /**
     * add a level-critical record
     * @method critical
     * @param {String} descriptor - to speed up search and improve understanding
     * @param {Mixed} [data] - additional data
     */
    critical(...args) {
        this._record('critical', ...args);
    }

    /**
     * initialize protocol
     * @method init
     * @static
     * @param {String} database - database name to use
     */
    static init(database) {
        return true;
    }

    /**
     * transform human readable time string, such as '3d', '.3' and '1.2' into Unix timestamp
     * the default relative time is Date.now(), if no second parameter is provided
     * @method transTimeFormat
     * @static
     * @param {String} time - time string to transform
     * @param {Number} [relative] - relative time to compare, default Date.now()
     * @return {Number|NaN} timestamp transformed
     */
    static transTimeFormat(time, relative) {
        // if falsy value or timestamp already, pass it through directly,
        if (!time || /^\d{13}$/.test(time)) {
            return +time;
        }
        // incase relative time isn't unix timestamp format,
        // neither a falsy value which will turned out to be Date.now()
        if (relative && !/^\d{13}$/.test(relative)) {
            throw new TypeError('relative time should be standard unix timestamp');
        }

        return (relative || Date.now()) - time.replace(/d$/, '') * 24 * 3600 * 1000;
    }

    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} from - time from, unix timestamp
     * @param {String} to - time end, unix timestamp
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    static get(from, to, readyFn) {
        util.throwError('method get is not implemented.');
    }

    /**
     * clean logs = keep limited logs
     * @method keep
     * @static
     * @param {Number} daysToMaintain - keep logs within days
     */
    static keep(daysToMaintain) {
        util.throwError('method keep is not implemented.');
    }

    /**
     * delete log database
     * @method clean
     * @static
     */
    static clean() {
        util.throwError('method clean is not implemented.');
    }

    /**
     * protocol status map
     * @prop {Object} STATUS
     */
    static get STATUS() {
        return {
            INITING: 1,
            INITED: 2,
            FAILED: 4
        };
    }
}
