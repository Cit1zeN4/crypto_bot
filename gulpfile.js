const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const nodemon = require("gulp-nodemon");

const tsProject = ts.createProject("tsconfig.json");
const outDir = "./dist";
const sourceMask = "./src/**/*";
const sourceMaskTs = `${sourceMask}.ts`;

function cleanTask() {
  return del(outDir);
}

function buildTask() {
  return gulp
    .src(sourceMaskTs)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(tsProject())
    .js.pipe(
      sourcemaps.write("./", {
        includeContent: false,
        sourceRoot: ".",
      })
    )
    .pipe(gulp.dest(outDir));
}

const defaultTask = gulp.series(cleanTask, buildTask);

function watchTask() {
  gulp.watch(sourceMaskTs, buildTask);
}

function startTask(done) {
  return nodemon({
    script: `${outDir}/index.js`,
    watch: outDir,
    delay: 1000,
    done,
  });
}

function devTask(done) {
  watchTask();
  gulp.series(defaultTask, startTask)(done);
}

exports.default = defaultTask;
exports.clean = cleanTask;
exports.build = buildTask;
exports.watch = watchTask;
exports.start = startTask;
exports.dev = devTask;
