var assert = require('chai').assert;
var jsdom = require('jsdom');
var StorageShim = require('node-storage-shim');

describe('Logline', function() {

    it('should correctly globally exposed', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            assert.equal(typeof window.Logline, 'function', true);
            assert.isFunction(window.Logline.using, 'static interface using');
            assert.isFunction(window.Logline.keep, 'static interface keep');
            assert.isFunction(window.Logline.clean, 'static interface clean');
            assert.isFunction(window.Logline.getAll, 'static interface getAll');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to specialfy any available protocols', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            // localstorage shims for jsdom
            window.localStorage = new StorageShim();

            window.Logline.using(window.Logline.PROTOCOL.LOCALSTORAGE);
            assert.isFunction(window.Logline._protocol, 'protocol should be a constructor');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

});


describe('WebsqlLogger', function() {

    it('should be able to choose localstorage protocol and interfaces are accessable', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            done();
            window.Logline.using('websql');
            let testLogger = new window.Logline('test');
            assert.isFunction(testLogger.info, 'instance interface info');
            assert.isFunction(testLogger.warn, 'instance interface warn');
            assert.isFunction(testLogger.error, 'instance interface error');
            assert.isFunction(testLogger.critical, 'instance interface critical');

            let WebsqlLogger = window.Logline._protocol;
            assert.isFunction(WebsqlLogger.init, 'static interface init');
            assert.isFunction(WebsqlLogger.all, 'static interface all');
            assert.isFunction(WebsqlLogger.keep, 'static interface keep');
            assert.isFunction(WebsqlLogger.clean, 'static interface keep');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to add and get records', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            done();
            window.Logline.using('websql');
            let testLogger = new window.Logline('test');
            let randomVars = window.Math.random().toString(36).slice(2,6);
            testLogger.info('info', randomVars[0]);
            testLogger.info('warn', randomVars[1]);
            testLogger.info('error', randomVars[2]);
            testLogger.info('critical', randomVars[3]);

            window.Logline._protocol.all(function(logs) {
                assert.isArray(logs, 'logs collect from database');
                assert.equal(logs[0].data, randomVars[0], true);
                assert.equal(logs[1].data, randomVars[1], true);
                assert.equal(logs[2].data, randomVars[2], true);
                assert.equal(logs[3].data, randomVars[3], true);
                done();
            });
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to keep the logs only we wanted', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to clean up the logs', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

});

describe('LocalStorageLogger', function() {

    it('should be able to choose localstorage protocol and interfaces are accessable', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            // localstorage shims for jsdom
            window.localStorage = new StorageShim();

            window.Logline.using(window.Logline.PROTOCOL.LOCALSTORAGE);
            let testLogger = new window.Logline('test');
            assert.isFunction(testLogger.info, 'prototype method `info` should be a function');
            assert.isFunction(testLogger.warn, 'prototype method `warn` should be a function');
            assert.isFunction(testLogger.error, 'prototype method `error` should be a function');
            assert.isFunction(testLogger.critical, 'prototype method `critical` should be a function');

            let LocalStorageLogger = window.Logline._protocol;
            assert.isFunction(LocalStorageLogger.init, 'method `init` should be a function');
            assert.isFunction(LocalStorageLogger.all, 'method `all` should be a function');
            assert.isFunction(LocalStorageLogger.keep, 'method `keep` should be a function');
            assert.isFunction(LocalStorageLogger.clean, 'method `clean` should be a function');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to add and get records', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            // localstorage shims for jsdom
            window.localStorage = new StorageShim();

            window.Logline.using(window.Logline.PROTOCOL.LOCALSTORAGE);
            window.Logline.keep(0);
            let testLogger = new window.Logline('test');
            let randomVars = window.Math.random().toString(36).slice(2, 6);
            testLogger.info('info', randomVars[0]);
            testLogger.info('warn', randomVars[1]);
            testLogger.info('error', randomVars[2]);
            testLogger.info('critical', randomVars[3]);

            window.Logline._protocol.all(function(logs) {
                assert.isArray(logs, 'logs collect from database should be an array');
                assert.equal(logs.length, 4, 'record length should be 4, currently ' + logs.length);
                assert.equal(logs[0].data, randomVars[0], 'record get from database is not the one we stored');
                assert.equal(logs[1].data, randomVars[1], 'record get from database is not the one we stored');
                assert.equal(logs[2].data, randomVars[2], 'record get from database is not the one we stored');
                assert.equal(logs[3].data, randomVars[3], 'record get from database is not the one we stored');
                done();
            });
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to keep the logs only we wanted', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            // localstorage shims for jsdom
            window.localStorage = new StorageShim();

            window.Logline.using(window.Logline.PROTOCOL.LOCALSTORAGE);
            window.Logline.keep(1);
            window.Logline.keep(.1);
            window.Logline.keep('a');
            window.Logline.keep({ a: 1 });
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('should be able to clean up the logs', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            // localstorage shims for jsdom
            window.localStorage = new StorageShim();

            window.Logline.using(window.Logline.PROTOCOL.LOCALSTORAGE).clean();
            try {
                window.Logline.clean();
                done();
            } catch (e) {
                if (window.localStorage.getItem('logline') !== undefined) {
                    throw new Error('log database is not properly removed');
                }
            }
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

});
