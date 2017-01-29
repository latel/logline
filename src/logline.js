import Interface from './protocols/interface';
import IndexeddbLogger from './protocols/indexeddb';
import LocalstorageLogger from './protocols/localstorage';
import WebsqlLogger from './protocols/websql';
import * as util from './lib/util';


class Logline {
    /**
     * Logline constructor
     * @constructor
     * @param {String} namespace - namespace to use
     * @return {Object Protocol Instance}
     */
    constructor(namespace) {
        Logline._checkProtocol();
        return new Logline._protocol(namespace);
    }

    /**
     * choose a protocol to initialize
     * @method _initProtocol
     * @private
     * @static
     * @param {Object Protocol Class} protocol - protocol to use, must under Logline.PROTOCOL
     * @return {Object} Logline
     */
    static _initProtocol(protocol) {
        Logline._protocol = protocol;
        Logline._protocol.init(Logline._database || 'logline');
    }

    /**
     * check protocol
     * if no protocol is chosen, will try to choose an available one automatically
     * if none of the protocols is available, an error will be thrown
     * @method _checkProtocol
     * @private
     * @static
     */
    static _checkProtocol() {
        if (!Logline._protocol) {
            let protocols = Object.keys(Logline.PROTOCOL), protocol;
            while ((protocol = Logline.PROTOCOL[protocols.shift()])) {
                if (protocol.support) {
                    Logline._initProtocol(protocol);
                    return;
                }
            }

            throw new Error(protocols.join(', ').toLowerCase() + ' protocols are not supported on this platform');
        }
    }

    /**
     * get logs in range
     * if from and end is not defined, will fetch full log
     * @method get
     * @static
     * @param {String} [from] - time from
     * @param {String} [to] - time end
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    static get(from, to, readyFn) {
        var now = Date.now();
        Logline._checkProtocol();

        switch (arguments.length) {
            case 1:
                readyFn = from;
                from = undefined;
                break;
            case 2:
                readyFn = to;
                to = undefined;
                break;
            case 3:
            default:
                break;
        }

        Logline._protocol.get(from, to, readyFn);
    }

    /**
     * read all logs
     * @method all
     * @static
     * @param {Function} readyFn - function to call back with logs as parameter
     */
    static all(readyFn) {
        Logline.get(readyFn);
    }

    /**
     * clean up logs = keep limited logs
     * @method keep
     * @static
     * @param {String} daysToMaintain - specialfy days to keep, support human readable format such as '3d', '.3'
     * @return {Object} Logline
     */
    static keep(daysToMaintain) {
        Logline._checkProtocol();
        Logline._protocol.keep(daysToMaintain);
        return this;
    }

    /**
     * delete log database
     * @method clean
     * @static
     * @return {Object} Logline
     */
    static clean() {
        Logline._checkProtocol();
        Logline._protocol.clean();
        return this;
    }

    /**
     * choose a protocol
     * @method using
     * @static
     * @param {Object Protocol Class} protocol - wanted protocol, should be on of Logline.PROTOCOL
     * @param {String} [database] - custome database name
     * @return {Object} Logline
     */
    static using(protocol, database) {
        // protocol unavailable is not allowed
        if (-1 === [IndexeddbLogger, LocalstorageLogger, WebsqlLogger].indexOf(protocol)) {
            util.throwError('specialfied protocol ' + (protocol ? (protocol + ' ') : '') + 'is not available');
        }

        // once protocol is selected, it shall not be changed during runtime
        if (Logline._protocol) {
            return this;
        }

        Logline.database(database || Logline._database);
        Logline._initProtocol(protocol);
        return this;
    }

    /**
     * specialfy a custome database name, in case of any conflicts
     * @methd database
     * @static
     * @param {String} name - target database name
     */
    static database(name) {
        Logline._database = name;
    }
}

// export protocols for modification and mounting
Logline.PROTOCOL = {
    INDEXEDDB: IndexeddbLogger,
    LOCALSTORAGE: LocalstorageLogger,
    WEBSQL: WebsqlLogger
};

// export protocol interface for user custom implements
Logline.INTERFACE = Object.freeze(Interface);

export default Logline;
