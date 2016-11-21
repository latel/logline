var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var argv = require('minimist')(process.argv.slice(2));


gulp.task('configure', function() {
    delete argv._;
    gulp.src(path.join(__dirname, '/src/configure'))
        .pipe(handlebars(
            {
                protocols: Object.keys(argv).map(function(name) {
                    return name.replace(/^with\-/, '');
                })
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
                    }
                }
            }
        ))
        .pipe(rename(pkg.name + '.js'))
        .pipe(gulp.dest('./src'));
});

gulp.task('default', [ 'configure' ]);
