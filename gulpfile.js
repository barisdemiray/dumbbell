var gulp = require('gulp');
var spawn = require('child_process').spawn;

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
gulp.task('start', gulp.series('welcome', 'start'));
