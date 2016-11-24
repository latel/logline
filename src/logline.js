import IndexeddbLogger from './protocols/indexeddb';
import LocalstorageLogger from './protocols/localstorage';
import WebsqlLogger from './protocols/websql';
import * as util from './lib/util';


class Logline {
    constructor(namespace) {
        Logline._checkProtocol();
        return new Logline._protocol(namespace);
    }

    // 检查协议
    static _checkProtocol() {
        if (!Logline._protocol) {
            util.throwError('you must choose a protocol with "using" method.');
        }
    }

    // 获取所有日志
    static getAll(readyFn) {
        Logline._checkProtocol();
        Logline._protocol.all(logs => readyFn(logs));
    }

    // 清理日志
    static keep(daysToMaintain) {
        try {
            Logline._checkProtocol();
            Logline._protocol.keep(daysToMaintain);
        } catch (e) {
            util.throwError('unable to remove logs earlier than ' + daysToMaintain + 'd.');
        }
        return this;
    }

    // 清空日志并删除数据库
    static clean() {
        try {
            Logline._checkProtocol();
            Logline._protocol.clean();
        } catch (e) { util.throwError('unable to clean log database.'); }
        return this;
    }

    // 选择一个日志协议
    static using(protocol) {
        // 协议一旦选定即不允许在运行时更改
        if (Logline._protocol) {
            return this;
        }

        if (-1 < [IndexeddbLogger, LocalstorageLogger, WebsqlLogger].indexOf(protocol)) {
            Logline._protocol = protocol;
            Logline.init();
        }
        else {
            util.throwError('specialfied protocol is not available.');
        }

        return this;
    }

    // 初始化选定的协议
    static init() {
        Logline._checkProtocol();
        Logline._protocol.init();

        return this;
    }
}

Logline.PROTOCOL = {
    INDEXEDDB: IndexeddbLogger,
    LOCALSTORAGE: LocalstorageLogger,
    WEBSQL: WebsqlLogger
};

module.exports = Logline;
