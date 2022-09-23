const gulp = require("gulp");
const watch = require("gulp-watch");
const ts = require("gulp-typescript"); //ts转js
const tsProject = ts.createProject("tsconfig.json");
const babel = require("gulp-babel");


gulp.task("default", function (cb) {
    // gulp.src("./packages/**/*.ts").pipe(gulp.dest("dist"));
    tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist/es"))
    // tsProject.src().pipe(tsProject()).js.pipe(babel()).pipe(gulp.dest("dist/lib"))
    // return watch("./packages/**/**.ts", function (e) {
    //     console.log('aaaaaaa', e);
        
    // })
    cb()
})

// module.exports = gulp.series();
