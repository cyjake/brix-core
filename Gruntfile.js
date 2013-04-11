module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/qunit.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    concat: {
      options: {
        separator: ';\n',
        banner: [
          '/**',
          ' * <%= pkg.description %> v<%= pkg.version %>',
          ' * ',
          ' * http://github.com/brixjs',
          ' */',
          '' // for the extra line break
        ].join('\n'),
        footer: ';\n'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'build/brix-<%= pkg.version %>.js'
      }
    },
    qunit: {
      all: {
        options: {
          urls: (function() {
            var base = 'http://localhost:5000/'
            var glob = require('glob')

            var urls = glob.sync('test/**/test-*.html').map(function(f) {
              return base + f
            })

            return urls
          })()
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 5000,
          base: '.',
          host: '0.0.0.0'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-qunit')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('test', ['connect', 'qunit'])
  grunt.registerTask('build', ['jshint', 'concat'])
}