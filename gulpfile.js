// Import everything important
const gulp = require('gulp');
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');

// For SASS -> CSS
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sassLint = require('gulp-sass-lint');

// HTML
const htmlmin = require('gulp-htmlmin');

// JavaScript/TypeScript
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Define Important Varaibles
const src = './src';
const dest = './dist';

// Function to copy manifest
const manifest = () => {
    return gulp.src(`${src}/manifest.json`)
        .pipe(gulp.dest(`${dest}/`))
}

// Function to copy assets
const assets = () => {
    return gulp.src(`${src}/assets/**/*`)
        .pipe(gulp.dest(`${dest}/assets`))
}

// Compile sass into css with gulp
const css = () => {
    // Find SASS
    return gulp.src(`${src}/sass/**/*.sass`)
        // Init Plumber
        .pipe(plumber())
        // Lint SASS
        .pipe(sassLint({
            options: {
                formatter: 'stylish',
            },
            rules: {
                'no-ids': 1,
                'final-newline': 0,
                'no-mergeable-selectors': 1,
                'indentation': 0
            }
        }))
        // Format SASS
        .pipe(sassLint.format())
        // Start Source Map
        .pipe(sourcemaps.init())
        // Compile SASS -> CSS
        .pipe(sass.sync({ outputStyle: "compressed" })).on('error', sass.logError)
        // add Suffix
        .pipe(rename({ basename: 'styles', suffix: ".min" }))
        // Add Autoprefixer & cssNano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Write Source Map
        .pipe(sourcemaps.write(''))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/css`))
        // Reload Page
        .pipe(browserSync.stream());
};

// Compile .html to minify .html
const html = () => {
    // Find SASS
    return gulp.src(`${src}/*.html`)
        // Init Plumber
        .pipe(plumber())
        // Compile HTML -> minified HTML
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            html5: true,
            removeEmptyAttributes: true,
            removeTagWhitespace: true,
            sortAttributes: true,
            sortClassName: true
        }))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}`));
};

// Compile .js to minify .js
const script = () => {
    // Find SASS
    return gulp.src(`${src}/js/**/*.js`)
        // Init Plumber
        .pipe(plumber(((error) => {
            gutil.log(error.message);
        })))
        // Start useing source maps
        .pipe(sourcemaps.init())
        // Use Babel
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        // JavaScript Lint
        .pipe(jshint())
        // Report of jslint
        .pipe(jshint.reporter('jshint-stylish'))
        // Minify
        .pipe(uglify())
        // add Suffix
        .pipe(rename({ suffix: ".min" }))
        // Write Sourcemap
        .pipe(sourcemaps.write(''))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/`));
};

// Function to watch our Changes and refreash page
const watch = () => gulp.watch([`${src}/*.html`, `${src}/js/**/*.js`, `${src}/sass/**/*.sass`, `${src}/manifest.json`], gulp.series(css, script, html, manifest, assets));

// All Tasks for this Project
const dev = gulp.series(css, script, html, manifest, assets, watch);

// Just Build the Project
const build = gulp.series(css, script, html);

// Default function (used when type gulp)
exports.dev = dev;
exports.build = build;
exports.default = build;
