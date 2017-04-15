import gulp from 'gulp'
// import browserify from 'browserify'
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins'

let plugin = gulpLoadPlugins(),
    sync = browserSync.create();

console.log('availiable plugins: ', Object.keys(plugin).join(', '));

function onerror(e) {
  console.log('>>> error:\n', e.name);
  console.log('---> message <---\n', e.message);
  console.log('---> reason <---\n', e.reason);
  // emit here
  this.emit('end');
}

gulp.task('browser-sync', () => {
    sync.init({
      server: {
        baseDir: "./dist"
      }
    });
  });

gulp
  .task('pug', () => {
    let mask = 'src/templates/**/**/**/**.pug';
    function run() {
      return gulp
        .src(mask)
        .pipe(plugin.pug())
        .on('error', onerror)
        .pipe(gulp.dest('dist/'))
        .pipe(sync.reload({ stream: true }))
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
  .task('stylus', () => {
    let mask = 'src/templates/**/**/**/**.styl';
    function run() {
      return gulp
        .src(mask)
        .pipe(plugin.stylus())
        .on('error', onerror)
        .pipe(gulp.dest('src/css/stylus'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
  .task('sass', () => {
    let mask = 'src/sass/**.scss';
    function run() {
      return gulp
        .src(mask)
        .pipe(plugin.sass())
        .pipe(plugin.cleanCss({
          keepSpecialComments: 0
        }))
        .on('error', onerror)
        .pipe(gulp.dest('src/css/sass'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
  .task('css.styles.concat', () => {
    let mask = 'src/css/stylus/**/**/**/**.css';
    function run() {
      return gulp
        .src(mask)
        .pipe(plugin.concat('styles.css'))
        .on('error', onerror)
        .pipe(gulp.dest('src/css/compiled'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
  .task('css.concat', () => {
    let mask = [
      'src/css/sass/bootstrap.css',
      'dist/bower/font-awesome/css/font-awesome.min.css',

      'src/css/compiled/sprites.css',
      'src/css/compiled/styles.css'
    ];

    function run() {
      return gulp
        .src(mask)
        .pipe(plugin.concat('all.css'))
        .pipe(plugin.cleanCss({
          keepSpecialComments: 0
        }))
        .on('error', onerror)
        .pipe(gulp.dest('src/css/compiled'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
  .task('css.min', () => {
    let mask = 'src/css/compiled/all.css';
    function run() {
      return gulp
        .src(mask)
        .pipe(plugin.cleanCss({
          keepSpecialComments: 0
        }))
        .on('error', onerror)
        .pipe(plugin.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.reload({ stream: true }))
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
  .task('copy', [
    'copy.fonts'
    ]);

gulp
  .task('copy.fonts', () => {
    let mask = [
      'dist/bower/font-awesome/fonts/**'
    ];
    function run() {
      return gulp
        .src(mask)
        .pipe(gulp.dest('dist/fonts'));
    }
    plugin.watch(mask, run);
    return run();
    })

gulp
  .task('css', [
    'sprites',
    'stylus',
    'sass',
    'css.styles.concat',
    'css.concat',
    'css.min',
    ]);

gulp
  .task('sprites', () => {
    let mask = 'src/sprites/*.{png,jpg}';
    function run() {
      var spriteOutput = gulp.src(mask)
        .pipe(plugin.spriteGenerator({
          baseUrl: './src/img',
          spriteSheetPath: './dist/img',
          spriteSheetName: 'sprite.png',
          }));

      spriteOutput.css.pipe(gulp.dest("./dist/css"));
      spriteOutput.img.pipe(gulp.dest("./dist/image"));

      return spriteOutput;
        // .pipe(plugin.if('*.png', gulp.dest('./dist/img/'), gulp.dest('src/css/compiled/')))
    }
    plugin.watch(mask, run);
    return run();
    });

// gulp
//   .task('browserify', () => {
//     let mask = 'src/templates/**/**/**/**.js';
//     function run() {
//       return browserify('')
//         .src(mask)
//         .pipe(plugin.cssmin())
//         .on('error', onerror)
//         .pipe(plugin.rename({suffix: '.min'}))
//         .pipe(gulp.dest('src/css'));
//     }
//     plugin.watch(mask, run);
//     run();
//   })

gulp
  .task('default', [
    'pug',
    'copy',
    'css',
    'browser-sync',
    // 'browserify',
    ]);