import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import bower from 'gulp-bower';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';

browserSync.create();

// Compile Sass, Autoprefix and minify
gulp.task('styles', () => gulp.src('./static/scss/**/*.scss')
  .pipe(plumber((error) => {
    gutil.log(gutil.colors.red(error.message));
    this.emit('end');
  }))
  .pipe(sourcemaps.init()) // Start Sourcemaps
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(gulp.dest('./../../static/css/'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(cssnano())
  .pipe(sourcemaps.write('.')) // Creates sourcemaps for minified styles
  .pipe(gulp.dest('./../../static/css/')),
);

// eslint, concat, and minify JavaScript
gulp.task('site-js', () => gulp.src([
  // Grab your custom scripts
  './../../static/js/*.js',
])
  .pipe(eslint({ configFile: './.eslintrc' }))
  .pipe(eslint.format())
  .pipe(babel({
    presets: ['./../../themes/foundation-theme/node_modules/babel-preset-es2015'],
    compact: true,
  }))
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./../../static/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.')) // Creates sourcemap for minified JS
  .pipe(gulp.dest('./../../static/js')),
);

// JSHint, concat, and minify Foundation JavaScript
gulp.task('foundation-js', () => gulp.src([
  // Foundation core - needed if you want to use any of the components below
  './vendor/foundation-sites/js/foundation.core.js',
  './vendor/foundation-sites/js/foundation.util.*.js',

  // Pick the components you need in your project
  './vendor/foundation-sites/js/foundation.abide.js',
  './vendor/foundation-sites/js/foundation.accordion.js',
  './vendor/foundation-sites/js/foundation.accordionMenu.js',
  './vendor/foundation-sites/js/foundation.drilldown.js',
  './vendor/foundation-sites/js/foundation.dropdown.js',
  './vendor/foundation-sites/js/foundation.dropdownMenu.js',
  './vendor/foundation-sites/js/foundation.equalizer.js',
  './vendor/foundation-sites/js/foundation.interchange.js',
  './vendor/foundation-sites/js/foundation.magellan.js',
  './vendor/foundation-sites/js/foundation.offcanvas.js',
  './vendor/foundation-sites/js/foundation.orbit.js',
  './vendor/foundation-sites/js/foundation.responsiveMenu.js',
  './vendor/foundation-sites/js/foundation.responsiveToggle.js',
  './vendor/foundation-sites/js/foundation.reveal.js',
  './vendor/foundation-sites/js/foundation.slider.js',
  './vendor/foundation-sites/js/foundation.sticky.js',
  './vendor/foundation-sites/js/foundation.tabs.js',
  './vendor/foundation-sites/js/foundation.toggler.js',
  './vendor/foundation-sites/js/foundation.tooltip.js',
])
  .pipe(babel({
    presets: ['./../../../node_modules/babel-preset-es2015'],
    compact: true,
  }))
  .pipe(gulp.src('./../../static/js/scripts.js'))
  .pipe(sourcemaps.init())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('./../../static/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.')) // Creates sourcemap for minified Foundation JS
  .pipe(gulp.dest('./../../static/js')),
);

// Update Foundation with Bower and save to /vendor
gulp.task('bower', () => bower({ cmd: 'update' })
  .pipe(gulp.dest('vendor/')),
);

// Browser-Sync watch files and inject changes
gulp.task('browsersync', () => {
  // Watch files
  const files = [
    './assets/css/*.css',
    './assets/js/*.js',
    '**/*.php',
    'assets/images/**/*.{png,jpg,gif,svg,webp}',
  ];
  browserSync.init(files, {
    // Replace with URL of your local site
    proxy: 'http://localhost/',
  });
  gulp.watch('./assets/scss/**/*.scss', ['styles']);
  gulp.watch('./assets/js/scripts/*.js', ['site-js']).on('change', browserSync.reload);
});

// Watch files for changes (without Browser-Sync)
gulp.task('watch', () => {
  // Watch .scss files
  gulp.watch('./assets/scss/**/*.scss', ['styles']);
  // Watch site-js files
  gulp.watch('./assets/js/scripts/*.js', ['site-js']);
  // Watch foundation-js files
  gulp.watch('./vendor/foundation-sites/js/*.js', ['foundation-js']);
});

// Run styles, site-js and foundation-js
gulp.task('default', () => {
  gulp.start('styles', 'site-js', 'foundation-js');
});
