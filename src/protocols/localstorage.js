import LoggerInterface from './interface';
import * as util from '../lib/util';

/**
 * localStorage日志协议
 * @class LocalStorageLogger
 */
export default class LocalStorageLogger extends LoggerInterface {
    /**
     * 构造函数
     * @constructor
     * @param {String} namespace - 日志的命名空间
     */
    constructor(...args) {
        super(...args);
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
        var logs = window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : [];
        logs.push([
            Date.now(),
            this._namesapce,
            level,
            descriptor,
            data
        ]);
        try {
            window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
        } catch (e) { util.throwError('error inserting record'); }
    }

    /**
     * 初始化协议
     * @method init
     * @static
     * @param {String} database - 初始化时要使用的数据库名
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
     * 读取所有日志内容
     * @method all
     * @static
     * @param {Function} readyFn - 用于读取日志内容的回调函数
     */
    static all(readyFn) {
        var logs = JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)), i;
        for (i = 0; i < logs.length; i++) {
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
     * 清理日志
     * @method keep
     * @static
     * @param {Number} daysToMaintain - 保留多少天数的日志
     */
    static keep(daysToMaintain) {
        var logs = !daysToMaintain ? [] : (window.localStorage.getItem(LocalStorageLogger._database) ? JSON.parse(window.localStorage.getItem(LocalStorageLogger._database)) : []).filter(log => {
            return log.time >= (Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000);
        });
        window.localStorage.setItem(LocalStorageLogger._database, JSON.stringify(logs));
    }

    /**
     * 删除日志数据库
     * @method clean
     * @static
     */
    static clean() {
        delete LocalStorageLogger.status;
        window.localStorage.removeItem(LocalStorageLogger._database);
    }

    /**
     * 是否支持localStorage
     * @prop {Boolean} support
     */
    static get support() {
        return 'localStorage' in window;
    }
}
