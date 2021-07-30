'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sass = require('gulp-sass');
var pkg = require('./package');
var pump = require('pump');

var scripts = {
      name: 'jquery.contextMenu.js',
      min: 'jquery.contextMenu.min.js',
      all: [
        'gulpfile.js',
        'src/jquery.contextMenu.js',
        'dist/jquery.contextMenu.js'
      ],
      main: 'dist/jquery.contextMenu.js',
      src: [
          'src/jquery.contextMenu.js'
      ],
      dest: 'dist',
      libs: [
      ]
    };
var styles = {
      name: 'jquery.contextMenu.css',
      min: 'jquery.contextMenu.min.css',
      all: [
        'src/sass/**/*.scss'
      ],
      main: 'dist/jquery.contextMenu.css',
      src: 'src/sass/jquery.contextMenu.scss',
      dest: 'dist'
    };
var icons = {
    src: 'src/icons/*.svg',
    templateFileFont: 'src/sass/icons/_variables.scss.tpl',
    templateFileIconClasses: 'src/sass/icons/_icon_classes.scss.tpl',
    fontOutputPath: 'dist/font',
    scssOutputPath: 'src/sass/icons/'
};
var replacement = {
      regexp: /@\w+/g,
      filter: function (placeholder) {
        switch (placeholder) {
          case '@VERSION':
            placeholder = pkg.version;
            break;

          case '@YEAR':
            placeholder = (new Date()).getFullYear();
            break;

          case '@DATE':
            placeholder = (new Date()).toISOString();
            break;
        }

        return placeholder;
      }
    };

gulp.task('jshint', function (cb) {
  pump([
      gulp.src(scripts.src),
      plugins.jshint('src/.jshintrc'),
      plugins.jshint.reporter('default')
  ],cb);
});

gulp.task('jsdist', function (cb) {
    pump([
        gulp.src(scripts.src),
        plugins.sourcemaps.init(),
        plugins.replace(replacement.regexp, replacement.filter),
        gulp.dest(scripts.dest),
        plugins.rename(scripts.min),
        plugins.uglify(),
        plugins.sourcemaps.write('.'),
        gulp.dest(scripts.dest)
    ], cb);
});


gulp.task('jslibs', function (cb){
    pump([
        gulp.src(scripts.libs),
        plugins.rename({prefix: 'jquery.ui.'}),
        gulp.dest('src'),
        gulp.dest('dist'),
        plugins.rename({extname: '.min.js'}),
        gulp.dest('dist'),
        plugins.uglify(),
        plugins.sourcemaps.write('.'),
        gulp.dest(scripts.dest)
    ], cb);
});

gulp.task('css', function (cb) {
    return pump([
        gulp.src(styles.src),
        sass(),
        plugins.csslint('src/.csslintrc'),
        plugins.csslint.formatter(),
        plugins.sourcemaps.init(),
        plugins.replace(replacement.regexp, replacement.filter),
        plugins.autoprefixer(),
    plugins.csscomb('src/.csscomb.json'),
    plugins.rename(styles.name),
    gulp.dest(styles.dest),
    plugins.rename(styles.min),
    plugins.cleanCss(),
    plugins.sourcemaps.write('.'),
    gulp.dest(styles.dest)
        ], cb);
});

gulp.task('build-icons', function (done) {
    var iconfont = require('gulp-iconfont');
    var consolidate = require('gulp-consolidate');

    return gulp.src(icons.src)
        .pipe(iconfont({
            fontName: 'context-menu-icons',
            fontHeight: 1024,
            descent: 64,
            normalize: true,
            appendCodepoints: false,
            startCodepoint: 0xE001,
			formats: ['ttf', 'eot', 'woff', 'woff2']
        }))
        .on('glyphs', function (glyphs) {
            var options = {
                glyphs: glyphs,
                className: 'context-menu-icon',
                mixinName: 'context-menu-item-icon'
            };

            gulp.src(icons.templateFileFont)
                .pipe(consolidate('lodash',  options))
                .pipe(plugins.rename({basename: '_variables', extname: '.scss'}))
                .pipe(gulp.dest(icons.scssOutputPath));

            gulp.src(icons.templateFileIconClasses)
                .pipe(consolidate('lodash', options))
                .pipe(plugins.rename('_icons.scss'))
                .pipe(gulp.dest('src/sass')); // set path to export your sample HTML
        })
        .pipe(gulp.dest(icons.fontOutputPath));

});

/**
 * Update paths in integration tests that are generated by the documentation
 * generator so they use the local source.
 */
gulp.task('integration-test-paths', function(){
    return gulp.src('test/integration/html/*.html').
        pipe(plugins.replace('https\:\/\/swisnl\.github\.io\/jQuery-contextMenu\/dist\/jquery\.ui\.position\.min\.js', '\.\.\/\.\.\/\.\.\/dist\/jquery\.ui\.position\.min\.js')).
        pipe(plugins.replace('https\:\/\/swisnl\.github\.io\/jQuery\-contextMenu\/dist\/', '\.\.\/\.\.\/\.\.\/src\/')).
        pipe(plugins.replace('\/src\/jquery.contextMenu.css', '\/dist\/jquery.contextMenu.css')).
        pipe(gulp.dest('test/integration/html/'));
});




gulp.task('js', gulp.series('jshint', 'jsdist', (done) => {
    done();
}));


gulp.task('watch', gulp.parallel('js', 'css', function (done) {
    gulp.watch(scripts.src,gulp.series('js'));
    gulp.watch(styles.all, gulp.series('css'));
    done();
}));
gulp.task('build', gulp.series('build-icons', 'css', 'js', 'integration-test-paths', (done) => {
    done();
}));

gulp.task('default', gulp.series('watch', (done) => {
    done();
}));