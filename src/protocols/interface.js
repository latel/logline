import * as util from '../lib/util';

/**
 * 日志协议原型类
 * @class Interface
 */
export default class Interface {
    /**
     * 构造函数
     * @constructor
     * @param {String} namespace - 日志的命名空间
     */
    constructor(namespace) {
        this._namesapce = namespace;
    }

    /**
     * 添加一条日志记录
     * @method _reocrd
     * @private
     * @parma {String} level - 日志等级
     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
     * @param {Mixed} data - 要记录的附加数据
     */
    _record(level, descriptor, data) {
        util.throwError('method _record is not implemented.');
    }

    /**
     * 添加一条等级为info的日志记录
     * @method info
     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
     * @param {Mixed} data - 要记录的附加数据
     */
    info(...args) {
        this._record('info', ...args);
    }

    /**
     * 添加一条等级为warn的日志记录
     * @method warn
     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
     * @param {Mixed} data - 要记录的附加数据
     */
    warn(...args) {
        this._record('warn', ...args);
    }

    /**
     * 添加一条等级为error的日志记录
     * @method error
     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
     * @param {Mixed} data - 要记录的附加数据
     */
    error(...args) {
        this._record('error', ...args);
    }

    /**
     * 添加一条等级为critical的日志记录
     * @method critical
     * @param {String} descriptor - 描述符，用于快速理解和全局搜索
     * @param {Mixed} data - 要记录的附加数据
     */
    critical(...args) {
        this._record('critical', ...args);
    }

    /**
     * 初始化协议
     * @method init
     * @static
     * @param {String} database - 初始化时要使用的数据库名
     */
    static init(database) {
        return true;
    }

    /**
     * 读取所有日志内容
     * @method all
     * @static
     * @param {Function} readyFn - 用于读取日志内容的回调函数
     */
    static all(readyFn) {
        readyFn([]);
    }

    /**
     * 清理日志
     * @method keep
     * @static
     * @param {Number} daysToMaintain - 保留多少天数的日志
     */
    static keep(daysToMaintain) {
        return true;
    }

    /**
     * 删除日志数据库
     * @method clean
     * @static
     */
    static clean() {
        return true;
    }

    /**
     * 协议状态MAP
     * @prop {Object} STATUS
     */
    static get STATUS() {
        return {
            INITING: 1, // 初始化中
            INITED: 2, // 初始化成功
            FAILED: 4 // 初始化失败
        };
    }
}
