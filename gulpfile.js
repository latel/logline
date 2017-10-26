var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var argv = require('minimist')(process.argv.slice(2));
var colors = require('colors');
var moment = require('moment');

function verbose(log) {
    console.log('[' + moment().format('HH:mm:ss').grey + '] ' + log);
}


gulp.task('configure', function() {
    var protocols = [];
    // 修正参数
    delete argv._;
    // 根据configure参数得到需要构建的协议
    if (!Object.keys(argv).length) {
        fse.walkSync(path.join(__dirname, '/src/protocols')).map(function(protocol) {
            if (/\.js$/.test(protocol)) {
                protocol = protocol.match(/(\w+)\.js$/)[1];
                if (protocol !== 'interface') {
                    protocols.push(protocol);
                }
            }
        });
    }
    else {
        protocols = Object.keys(argv).map(function(name) {
            return name.replace(/^with\-/, '');
        });
    }

    verbose('Using protocols(priority is respected): ' + protocols.join().magenta);

    gulp.src(path.join(__dirname, '/src/configure'))
        .pipe(handlebars(
            {
                protocols: protocols
            },
            {
                helpers: {
                    compare: function(v1, v2, options) {
                        if (v1 - 1 > v2) {
                            return options.fn(this);
                        }
                        else {
                            return options.inverse(this);
                        }
                    },
                    upper: function(str, all) {
                        return all ? str.toUpperCase() : str.replace(/^(\w)(.*)/, function(str, cap, rest) {
                            return cap.toUpperCase() + rest;
                        });
                    },
                    join: function(joiner, postFix, seperator) {
                        return joiner.map(function(str) {
                            return (str + postFix).replace(/^\w/, function(cap) {
                                return cap.toUpperCase();
                            });
                        }).join(seperator);
                    }
                }
            }
        ))
        .pipe(rename(pkg.name + '.js'))
        .pipe(gulp.dest('./src'));
});

gulp.task('default', [ 'configure' ]);
