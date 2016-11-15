import Interface from './interface';
import * as util from './lib/util';

export default class WebsqlLogger extends Interface {
    constructor(...args) {
        super(...args);
    }

    _record(level, descriptor, data, triedTimes) {
        var self = this, args = arguments;

        if (!triedTimes || triedTimes < 10) {
            if (WebsqlLogger._inited) {
                try {
                    WebsqlLogger._db.transaction(function(tx) {
                        tx.executeSql(
                            'INSERT INTO logs (time, namespace, level, descriptor, data) VALUES(?, ?, ?, ? ,?)',
                            [Date.now(), self._namesapce, level, descriptor, (data === undefined || data === '') ? '' : (JSON.stringify(data) || '')],
                            function() {/* empty func */},
                            function(e) {throw e;}
                        );
                    });
                } catch (e) { util.displayError('error inserting record'); }
            }
            else {
                setTimeout(function() {
                    switch (args.length) {
                    case 2:
                        Array.prototype.push.call(args, '', 1);
                        break;
                    case 3:
                        Array.prototype.push.call(args, 1);
                        break;
                    case 4:
                        Array.prototype.push.call(args = Array.prototype.slice.call(args, 0, 3), triedTimes + 1);
                        break;
                    default:
                        break;
                    }
                    self._record.apply(self, args);
                });
            }
        }
    }

    static init() {
        if (!('openDatabase' in window)) {
            util.displayError('your platform does not support websql.');
        }
        try {
            WebsqlLogger._db = window.openDatabase('logline', '1.0', 'cats loves logs', 4.85 * 1024 * 1024);
            WebsqlLogger._db.transaction(function(tx) {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS logs (time, namespace, level, descriptor, data)',
                    [],
                    function() {
                        WebsqlLogger._inited = true;
                    },
                    function() {
                        WebsqlLogger._inited = false;
                    }
                );
            });
        } catch (e) { util.displayError('unable to init log database.'); }
    }

    static all(readyFn) {
        try {
            WebsqlLogger._db.transaction(function(tx) {
                tx.executeSql(
                    'SELECT * FROM logs',
                    [],
                    function(tx, res) {
                        var logs = [], index = res.rows.length;
                        while (--index >= 0) {
                            logs.push(res.rows.item(index));
                        }
                        readyFn(logs);
                    },
                    function(e) {throw e;}
                );
            });
        } catch (e) { util.displayError('unable to collect logs from database.'); }
    }

    static keep(daysToMaintain) {
        try {
            WebsqlLogger._db.transaction(function(tx) {
                if (daysToMaintain) {
                    tx.executeSql(
                        'DELETE FROM logs WHERE time < ?',
                        [Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000],
                        function() {/* empty func */},
                        function(e) {throw e;}
                    );
                }
                else {
                    tx.executeSql(
                        'DELETE FROM logs',
                        [],
                        function() {/* empty func */},
                        function(e) {throw e;}
                    );
                }
            });
        } catch (e) { util.displayError('unable to clean logs from database.'); }
    }

    static drop() {
        try {
            WebsqlLogger._db.transaction(function(tx) {
                tx.executeSql(
                    'DROP TABLE logs',
                    [],
                    function() {/* empty func */},
                    function(e) {throw e;}
                );
            });
        } catch (e) { util.displayError('unable to remove log database.'); }
    }
}
