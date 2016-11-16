import LocalStorageLogger from './localstorage';
import WebsqlLogger from './Websql';
import * as util from './lib/util';

let LogcatInterface = function(namespace) {
    LogcatInterface._checkProtocol();
    return new LogcatInterface._protocol(namespace);
};

class Logline {
    constructor(namespace) {
        Logline._checkProtocol();
        return new Logline._protocol(namespace);
    }

    // 检查协议
    static _checkProtocol() {
        if (!Logline._protocol) {
            util.displayError('you must choose a protocol with "using" method.');
        }
    }

    // 发送日志
    static deploy(descriptor, tickerFn, readyFn, errorFn) {
        Logline._checkProtocol();
        if (Logline._reportTo) {
            Logline._protocol.all(function(logs) {
                var xhr = new XMLHttpRequest(),
                    logsToSend = [],
                    log, key, line;

                xhr.upload.onprogress = tickerFn;
                xhr.onload = function() {
                    if (200 === xhr.status) {
                        'function' === typeof readyFn && readyFn();
                    }
                    else {
                        'function' === typeof errorFn && errorFn();
                    }
                };
                xhr.onerror = function() {
                    'function' === typeof errorFn && errorFn();
                };
                xhr.open('POST', LogcatInterface._reportTo);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                // 处理logs成常见的日志形式来上报(一行一条日志内容)，避免重复键名占用空间
                while ((log = logs.pop())) {
                    line = [];
                    for (key in log) {
                        if (log.hasOwnProperty(key) && log[key]) {
                            line.push(log[key]);
                        }
                    }
                    logsToSend.push(line.join('\t'));
                }

                xhr.withCredentials = true;
                logsToSend.unshift(location.host + (descriptor ? (': ' + descriptor) : ''));
                xhr.send('data=' + (escape(logsToSend.join('\n')) || 'no data'));
            });
        }
        else {
            util.displayError('report address is not configed.');
        }
    }

    // 清理日志
    static keep(daysToMaintain) {
        try {
            Logline._checkProtocol();
            Logline._protocol.keep(daysToMaintain);
        } catch (e) {
            util.displayError('unable to clean log database.');
        }
        return this;
    }

    // 清空日志并删除数据库
    static clean() {
        try {
            Logline._checkProtocol();
            Logline._protocol.clean();
        } catch (e) { util.displayError('unable to clean log database.'); }
        return this;
    }

    // 选择一个日志协议
    static using(protocol) {
        // 协议一旦选定即不允许在运行时更改
        if (Logline._protocol) {
            return this;
        }

        switch (protocol) {
        case 'localstorage':
            Logline._protocol = LocalStorageLogger;
            break;
        case 'websql':
        default:
            Logline._protocol = WebsqlLogger;
            break;
        }

        Logline._protocol.init();
        return this;
    }

    // 配置日志上报地址
    static reportTo(reportTo) {
        Logline._reportTo = reportTo;
        return this;
    }
}

Logline._protocol = null;
Logline._reportTo = null;

module.exports = Logline;
