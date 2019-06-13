module.exports = function (grunt) {
    require("grunt-browserify")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        browserify: {
            dev: {
                src: ["static/src/Game.js"],
                dest: "static/build/output.js",
                options: {
                    transform: [["babelify", {"presets": ["es2015"]}]],
                    browserifyOptions: {debug: true}
                }
            },
            watch: {
                src: ["static/src/Game.js"],
                dest: "static/build/output.js",
                options: {
                    transform: [["babelify", {"presets": ["es2015"]}]],
                    browserifyOptions: {debug: true},
                    watch: true,
                    keepAlive: true
                }
            },
        }
    });

    grunt.registerTask("default", ["dev"]);
    grunt.registerTask("dev", ["browserify:dev"]);
    grunt.registerTask("watch", ["browserify:watch"]);
};