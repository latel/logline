var assert = require('chai').assert;
var jsdom = require('jsdom');
var StorageShim = require('node-storage-shim');

describe('Logline', function() {

    it('global exposed and interface', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            assert.equal(typeof window.Logline === 'function', true);
            assert.isFunction(window.Logline.using, 'static interface using');
            assert.isFunction(window.Logline.reportTo, 'static interface reportTo');
            assert.isFunction(window.Logline.deploy, 'static interface deploy');
            assert.isFunction(window.Logline.clean, 'static interface clean');
            assert.isFunction(window.Logline.keep, 'static interface keep');
            assert.isFunction(window.Logline.drop, 'static interface drop');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('specialfy protocol', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            window.Logline.using('websql');
            assert.isFunction(window.Logline._protocol, 'protocol is now a constructor');
            assert.isTrue(/\websql\w+\(/i.test(window.Logline._protocol), 'protocol set to websql');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('specialfy report address', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            window.Logline.reportTo('//mydomain.com/log.fcgi');
            assert.equal(window.Logline._reportTo === '//mydomain.com/log.fcgi', true);
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

});


describe('WebsqlLogger', function() {

    it('websql interface', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
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
            assert.isFunction(WebsqlLogger.drop, 'static interface drop');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('add record', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            window.Logline.using('websql');
            let testLogger = new window.Logline('test');
            let randomVars = window.Math.random().toString(36).slice(2,6);
            testLogger.info('info', randomVars[0]);
            testLogger.info('warn', randomVars[1]);
            testLogger.info('error', randomVars[2]);
            testLogger.info('critical', randomVars[3]);

            console.log(window.Logline._protocol.all.toString());
            window.Logline._protocol.all(function(logs) {
                console.log(logs);
                assert.isArray(logs, 'logs collect from database');
                assert.equal(logs[0].data === randomVars[0], true);
                assert.equal(logs[1].data === randomVars[1], true);
                assert.equal(logs[2].data === randomVars[2], true);
                assert.equal(logs[3].data === randomVars[3], true);
                done();
            });
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

});

describe('LocalStorageLogger', function() {

    it('localstorage interface', function(done) {
        jsdom.env('./example/index.html', function(err, window) {
            // localstorage shims for jsdom
            window.localStorage = new StorageShim();

            window.Logline.using('localstorage');
            let testLogger = new window.Logline('test');
            assert.isFunction(testLogger.info, 'instance interface info');
            assert.isFunction(testLogger.warn, 'instance interface warn');
            assert.isFunction(testLogger.error, 'instance interface error');
            assert.isFunction(testLogger.critical, 'instance interface critical');

            let LocalStorageLogger = window.Logline._protocol;
            assert.isFunction(LocalStorageLogger.init, 'static interface init');
            assert.isFunction(LocalStorageLogger.all, 'static interface all');
            assert.isFunction(LocalStorageLogger.keep, 'static interface keep');
            assert.isFunction(LocalStorageLogger.drop, 'static interface drop');
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

});
