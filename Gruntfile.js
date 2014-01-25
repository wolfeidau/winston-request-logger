module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        test: {
            files: ['test/**/*.js']
        },
        watch: {
            files: '<%= cfg.jshint.all.files %>',
            tasks: 'default'
        },
        jshint: {
            src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                asi: true,
                curly: true,
                laxcomma: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                "strict": false,
                "predef": [
                    "describe",     // Used by mocha
                    "it",           // Used by mocha
                    "before",       // Used by mocha
                    "beforeEach",   // Used by mocha
                    "after",        // Used by mocha
                    "afterEach"     // Used by mocha
                ],
                globals: {
                    exports: true
                }
            }
        },
        simplemocha: {
            all:{
                src: 'test/**/*.js',
                options: {
                    globals: ['should'],
                    timeout: 3000,
                    ignoreLeaks: false,
                    ui: 'bdd',
                    reporter: 'spec'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', ['jshint', 'simplemocha']);

    // override the default test target
    grunt.registerTask('test', 'simplemocha');
};