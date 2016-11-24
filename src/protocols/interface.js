import * as util from '../lib/util';

export default class Interface {
    constructor(namespace) {
        this._namesapce = namespace;
    }

    // 添加一条日志记录
    _record(level, descriptor, data) {
        util.throwError('method _record is not implemented.');
    }

    // 添加一条等级为info的日志记录
    info(...args) {
        this._record('info', ...args);
    }

    // 添加一条等级为warn的日志记录
    warn(...args) {
        this._record('warn', ...args);
    }

    // 添加一条等级为error的日志记录
    error(...args) {
        this._record('error', ...args);
    }

    // 添加一条等级为critical的日志记录
    critical(...args) {
        this._record('critical', ...args);
    }
}
