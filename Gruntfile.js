module.exports = function(grunt){

    function pathSource( _path ){
        return 'source/%s'.replace('%s', _path);
    }

    function pathBuild( _path ){
        return 'public/assets/%s'.replace('%s', _path);
    }

    // Basic configs
    var _baseConfigs = {
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> (v<%= pkg.version %>); <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        filename: '<%= pkg.name %>',
        // concat task
        concat: { all: { files: {} } },
        // uglify task
        uglify: {
            options: {banner: '<%= banner %>', expand: true},
            all: { files: {} }
        },
        // sass shtuff
        sass: {
            options: {style: 'compressed', compass: true},
            all: { files: [] }
        },
        // watch
        watch: {}
    }

    /**
     * Concat settings
     */
    _baseConfigs.concat.all.files[ pathBuild('js/index.js') ] = [
        pathSource('js/index.js')
    ];

    _baseConfigs.concat.all.files[ pathBuild('js/control.js') ] = [
        pathSource('js/control.js')
    ];


    /**
     * Uglify settings (just loop through any concat'd files above and minify those in place).
     */
    for( var _key in _baseConfigs.concat.all.files ){
        _baseConfigs.uglify.all.files[_key] = _key;
    }


    /**
     * SASS
     */
    _baseConfigs.sass.all.files = [
        {src: [pathSource('sass/index.scss')], dest: pathBuild('css/index.css')},
        {src: [pathSource('sass/control.scss')], dest: pathBuild('css/control.css')}
    ];


    /**
     * Watch errrthang
     */
    _baseConfigs.watch.all = {
        files: [pathSource('**/*.js'), pathSource('**/*.scss')],
        tasks: ['newer:concat:all', 'newer:sass:all']
    }


    // Task modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-newer');

    // Pass the config rules
    grunt.initConfig(_baseConfigs);

    // Default task
    grunt.registerTask('default', []);
    grunt.registerTask('build-dev', ['concat:all', 'uglify:all', 'sass:all']);

}