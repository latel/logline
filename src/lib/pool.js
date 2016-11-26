// pool for deferred api calling
export default class Pool {
    constructor() {
        this._pool = [];
    }

    push(handler, context) {
        handler.context = context;
        this._pool.push(handler);
    }

    consume() {
        var handler;
        while ((handler = this._pool.shift())) {
            handler.call(handler.context);
        }
    }
}
