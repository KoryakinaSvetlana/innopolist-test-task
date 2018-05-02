"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minifycss = require("gulp-csso");
var minifyjs = require("gulp-uglify");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var del = require("del");
var run = require('run-sequence');
var include = require("posthtml-include");
var posthtml = require("gulp-posthtml");
var htmlmin = require('gulp-htmlmin');

/*Сбор и минимизация стилей*/
gulp.task("style", function () {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minifycss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

/*Минимизация js*/
gulp.task('js', function () {
  gulp.src(['source/scripts/*.js', '!source/scripts/*.min.js'])
    .pipe(plumber())
    .pipe(minifyjs())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/scripts'));
});

/*SVG Sprite*/
gulp.task("sprite", function () {
  return gulp.src(["source/img/sign-icon.svg",
      "source/img/check-icon.svg",
      "source/img/encode-icon.svg",
      "source/img/decode-icon.svg"])
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

/*PostHtml*/
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

/*Copy*/
gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/scripts/**"
      ], {
      base: "source"
      })
    .pipe(gulp.dest("build"));
});

/*Clean*/
gulp.task("clean", function () {
  return del("build");
});

/*Build*/
gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "js",
    "sprite",
    "html",
    done
  );
});

/*Watch*/
gulp.task("serve", function() {
  server.init({
    server: "build/"
  });

  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/*.html", ["html"]);
});
