/**
 * Pool, for storage of async calling
 * @class Pool
 */
export default class Pool {
    /**
     * Pool constructor
     * @constructor
     */
    constructor() {
        this._pool = [];
    }

    /**
     * add an procedure
     * @method push
     * @param {Function} handler - procedure handler
     * @param {Object} context - procedure context
     */
    push(handler, context) {
        handler.context = context;
        this._pool.push(handler);
    }

    /**
     * consume pool
     * @method consume
     */
    consume() {
        var handler;
        while ((handler = this._pool.shift())) {
            handler.call(handler.context);
        }
    }
}
