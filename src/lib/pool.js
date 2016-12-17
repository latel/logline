/**
 * 队列池，用于异步调用过程的寄存
 * @class Pool
 */
export default class Pool {
    /**
     * 队列池构造器
     * @constructor
     */
    constructor() {
        this._pool = [];
    }

    /**
     * 向队列中添加过程
     * @method push
     * @param {Function} handler - 过程函数
     * @param {Object} context - 过程函数的上下文
     */
    push(handler, context) {
        handler.context = context;
        this._pool.push(handler);
    }

    /**
     * 消费队列
     * @method consume
     */
    consume() {
        var handler;
        while ((handler = this._pool.shift())) {
            handler.call(handler.context);
        }
    }
}
