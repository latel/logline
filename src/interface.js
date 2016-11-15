import * as util from './lib/util';

export default class Interface {
    constructor(namespace) {
        this._namesapce = namespace;
    }

    // 添加一条日志记录
    _record(level, descriptor, data) {
        util.displayError('_record is not implemented.');
    }

    // 添加一条等级为info的日志记录
    info() {
        this._record.apply(this, Array.prototype.unshift.call(arguments, 'info') && arguments);
    }

    // 添加一条等级为warn的日志记录
    warn() {
        this._record.apply(this, Array.prototype.unshift.call(arguments, 'warning') && arguments);
    }

    // 添加一条等级为error的日志记录
    error() {
        this._record.apply(this, Array.prototype.unshift.call(arguments, 'error') && arguments);
    }

    // 添加一条等级为critical的日志记录
    critical() {
        this._record.apply(this, Array.prototype.unshift.call(arguments, 'critical') && arguments);
    }
}
