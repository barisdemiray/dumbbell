var gulp = require('gulp');
var spawn = require('child_process').spawn;

/**
 * Runs dependencies of both frontend and backend.
 */
gulp.task('install', function (done) {
  console.log('Installing backend dependencies');
  spawn('yarn', ['install'], { cwd: 'backend/', stdio: 'inherit' }).on('close', done);

  console.log('Installing frontend dependencies');
  spawn('yarn', ['install'], { cwd: 'frontend/', stdio: 'inherit' }).on('close', done);
});

/**
 * Simply shows a welcome message.
 */
gulp.task('welcome', function (done) {
  console.log('Starting the project, once you are done quit with Ctrl+C');
  done();
});

/**
 * Starts the backend and then the frontend
 */
gulp.task('start', function (done) {
  console.log('Starting backend');
  spawn('node', ['index.js'], { cwd: 'backend/', stdio: 'inherit' }).on('close', done);

  console.log('Starting frontend');
  spawn('yarn', ['start'], { cwd: 'frontend/', stdio: 'inherit' }).on('close', done);
});

/**
 * Here we chain a few Gulp tasks.
 *
 * - Show a welcome message
 * - Start the backend and the frontend
 */
gulp.task('run', gulp.series('welcome', 'start'));

/**
 * Run unit tests.
 */
gulp.task('test', function (done) {
  console.log('Starting backend tests');
  spawn('yarn', ['test'], { cwd: 'backend/', stdio: 'inherit' }).on('close', done);

  // Here we disable code change watching since we want tests to run once
  console.log('Starting frontend tests');
  spawn('yarn', ['test', '--watchAll=false', '--testTimeout=30000'], {
    cwd: 'frontend/',
    stdio: 'inherit',
  }).on('close', done);
});
