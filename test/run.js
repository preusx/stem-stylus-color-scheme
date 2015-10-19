var testRunnerConfig = {
  describe: 'Stem stylus color scheme',
  stylus: {
    use: function plugin(stylus) {
      stylus.include(__dirname + '../');
    },
    import: [
      '../bower_components/stem-stylus-utils',
      '../icon'
      ]
  }
}

require('stylus-test-runner')(testRunnerConfig)