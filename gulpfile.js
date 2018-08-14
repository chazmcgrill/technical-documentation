const gulp = require("gulp");
const uglify = require("gulp-uglify-es").default;
const browserSync = require('browser-sync').create();
const plugs = require('gulp-load-plugins')({lazy: false});

const DEV_DIR = './dist/';

// -- FILE PATHS

const paths = {
  sass: {
    src: 'src/css/**/*.sass',
    dist: 'dist/assets/css'
  },
  html: {
    src: './src/*.html',
    watch: './src/*.html',
    dist: 'dist'
  },
  js: {
    src: 'src/js/**/*.js',
    dist: 'dist/assets/js'
  },
  img: {
    src: 'src/img/*',
    dist: 'dist/assets/img'
  }  
}


// -- FILE TASKS

gulp.task('html', () => {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dist));
});

gulp.task('sass', () => {
  return gulp.src(paths.sass.src)
    .pipe(plugs.sass().on('error', plugs.sass.logError))
    .pipe(gulp.dest(paths.sass.dist));
});

gulp.task('scripts', () => {
  return gulp.src(paths.js.src)
    .pipe(plugs.babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(plugs.concat('app.js'))
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('image-min', () => {
  return gulp.src(paths.img.src)
    .pipe(plugs.imagemin([
      plugs.imagemin.jpegtran({ progressive: true }),
      plugs.imagemin.optipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulp.dest(paths.img.dist))
});


// -- MAIN TASKS

gulp.task('browser-sync', () => {
  browserSync.init({
    server: { baseDir: DEV_DIR }
  });

  gulp.watch(paths.html.watch, gulp.series("html")).on('change', browserSync.reload);
  gulp.watch(paths.js.src, gulp.series("scripts")).on('change', browserSync.reload);
  gulp.watch(paths.img.src, gulp.series("image-min")).on('change', browserSync.reload);
  gulp.watch(paths.sass.src, gulp.series("sass")).on('change', browserSync.reload);
});

const build = gulp.series('sass', 'scripts', 'image-min', 'html', 'browser-sync');

gulp.task('default', gulp.parallel(build));
gulp.task('prod', gulp.parallel(build));

